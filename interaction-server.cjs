const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');
try { require('dotenv').config(); } catch(e) {}

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = process.env.VITE_MODEL || 'gemini-2.5-flash';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const PROCESSES_FILE = path.join(DATA_DIR, 'processes.json');
const BASE_PROCESSES_FILE = path.join(DATA_DIR, 'processes.json');
const SIGNAL_FILE = path.join(__dirname, 'interaction-signals.json');
const KB_PATH = path.join(__dirname, 'knowledge_base.md');
const FEEDBACK_QUEUE_PATH = path.join(__dirname, 'feedbackQueue.json');
const KB_VERSIONS_PATH = path.join(DATA_DIR, 'kbVersions.json');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');

let state = { sent: false, confirmed: false, signals: {} };
const runningProcesses = new Map();

// --- Startup Initialization ---
if (!fs.existsSync(PROCESSES_FILE) && fs.existsSync(BASE_PROCESSES_FILE)) {
    fs.copyFileSync(BASE_PROCESSES_FILE, PROCESSES_FILE);
}
if (!fs.existsSync(SIGNAL_FILE)) {
    fs.writeFileSync(SIGNAL_FILE, '{}');
}
if (!fs.existsSync(FEEDBACK_QUEUE_PATH)) {
    fs.writeFileSync(FEEDBACK_QUEUE_PATH, '[]');
}
if (!fs.existsSync(KB_VERSIONS_PATH)) {
    fs.writeFileSync(KB_VERSIONS_PATH, '[]');
}
if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

// --- Gemini Helper ---
async function callGemini(systemPrompt, messages) {
    if (!GEMINI_API_KEY) return { error: 'No GEMINI_API_KEY configured' };
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction: systemPrompt });
    const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));
    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMsg.content);
    return { response: result.response.text() };
}

// --- Body Parser ---
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch(e) { reject(e); }
        });
    });
}

// --- MIME Types ---
const mimeTypes = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.webm': 'video/webm',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.md': 'text/markdown',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

// --- HTTP Server ---
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const cleanPath = parsedUrl.pathname;

    // OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // GET /reset
    if (cleanPath === '/reset') {
        state = { sent: false, confirmed: false, signals: {} };
        console.log('Demo Reset Triggered');
        fs.writeFileSync(SIGNAL_FILE, JSON.stringify({}, null, 4));

        runningProcesses.forEach((proc, id) => {
            try { process.kill(-proc.pid, 'SIGKILL'); } catch (e) { }
        });
        runningProcesses.clear();

        exec('pkill -9 -f "node(.*)simulation_scripts" || true', (err) => {
            setTimeout(() => {
                const cases = [
                    {
                        id: "CSC-2026-0309-AON-0847",
                        name: "Three Requests in One Email",
                        category: "Smart Service Management",
                        stockId: "CSC-2026-0309-AON-0847",
                        status: "Needs Attention",
                        client: "Aon plc (UK)",
                        cardholder: "Sophia Chen",
                        process: "PA Email — Multi-Request Resolution",
                        sm: "David Mensah",
                        pathway: "Decline Investigation → Travel Activation → Limit Increase → Spend Data"
                    },
                    {
                        id: "CSC-2026-0309-CC-0291",
                        name: "Routine Limit Increase Uncovers an Unactioned Fraud Alert",
                        category: "Smart Service Management",
                        stockId: "CSC-2026-0309-CC-0291",
                        status: "Needs Attention",
                        client: "Clifford Chance LLP (UK)",
                        cardholder: "Richard Okafor",
                        process: "PA Email — Exception Handling with HITL",
                        sm: "Sarah Okonkwo",
                        pathway: "Limit Request → Fraud Alert Detected → HITL → Hold & Escalate"
                    },
                    {
                        id: "CSC-2026-0309-HSF-0314",
                        name: "Cardholder Name Change — Three-Document Identity Chain",
                        category: "Smart Service Management",
                        stockId: "CSC-2026-0309-HSF-0314",
                        status: "Needs Attention",
                        client: "Herbert Smith Freehills LLP (UK)",
                        cardholder: "Eleanor Whitfield-Osei",
                        process: "PA Email — Document Ingestion & Identity Chain Validation",
                        sm: "David Mensah",
                        pathway: "Email Received → Marriage Cert Extracted → MiVision Cross-Ref → Discrepancy → Doc Request → Passport Received → Identity Chain Validated → Name Changed → Replacement Card"
                    }
                ];
                fs.writeFileSync(PROCESSES_FILE, JSON.stringify(cases, null, 4));

                // Reset process log files
                const emptyLog = JSON.stringify({ logs: [], keyDetails: {} }, null, 4);
                ["CSC-2026-0309-AON-0847", "CSC-2026-0309-CC-0291", "CSC-2026-0309-HSF-0314"].forEach(id => {
                    const f = path.join(DATA_DIR, `process_${id}.json`);
                    if (fs.existsSync(f)) fs.writeFileSync(f, emptyLog);
                });

                fs.writeFileSync(FEEDBACK_QUEUE_PATH, '[]');
                fs.writeFileSync(KB_VERSIONS_PATH, '[]');

                const scripts = [
                    { file: 'SSM_001.cjs', id: 'CSC-2026-0309-AON-0847' },
                    { file: 'SSM_002.cjs', id: 'CSC-2026-0309-CC-0291' },
                    { file: 'SSM_003.cjs', id: 'CSC-2026-0309-HSF-0314' }
                ];
                let totalDelay = 0;
                scripts.forEach((script) => {
                    setTimeout(() => {
                        const scriptPath = path.join(__dirname, 'simulation_scripts', script.file);
                        const child = exec(
                            `node "${scriptPath}" > "${scriptPath}.log" 2>&1`,
                            (error) => {
                                if (error && error.code !== 0) console.error(`${script.file} error:`, error.message);
                                runningProcesses.delete(script.id);
                            }
                        );
                        runningProcesses.set(script.id, child);
                    }, totalDelay * 1000);
                    totalDelay += 2;
                });
            }, 1000);
        });
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    // GET /email-status
    if (cleanPath === '/email-status' && req.method === 'GET') {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sent: state.sent }));
        return;
    }

    // POST /email-status
    if (cleanPath === '/email-status' && req.method === 'POST') {
        const body = await parseBody(req);
        state.sent = body.sent === true;
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', sent: state.sent }));
        return;
    }

    // GET /signal-status
    if (cleanPath === '/signal-status' && req.method === 'GET') {
        let signals = {};
        try { signals = JSON.parse(fs.readFileSync(SIGNAL_FILE, 'utf8')); } catch(e) {}
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(signals));
        return;
    }

    // POST /signal
    if (cleanPath === '/signal' && req.method === 'POST') {
        const body = await parseBody(req);
        let signals = {};
        try { signals = JSON.parse(fs.readFileSync(SIGNAL_FILE, 'utf8')); } catch(e) {}
        signals[body.signal] = true;
        const tmp = SIGNAL_FILE + '.' + Math.random().toString(36).substring(7) + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(signals, null, 4));
        fs.renameSync(tmp, SIGNAL_FILE);
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    // POST /api/update-status
    if (cleanPath === '/api/update-status' && req.method === 'POST') {
        const body = await parseBody(req);
        try {
            const processes = JSON.parse(fs.readFileSync(PROCESSES_FILE, 'utf8'));
            const idx = processes.findIndex(p => p.id === String(body.id));
            if (idx !== -1) {
                processes[idx].status = body.status;
                processes[idx].currentStatus = body.currentStatus;
                fs.writeFileSync(PROCESSES_FILE, JSON.stringify(processes, null, 4));
            }
        } catch(e) {}
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    // GET /debug-paths
    if (cleanPath === '/debug-paths' && req.method === 'GET') {
        const files = fs.existsSync(DATA_DIR) ? fs.readdirSync(DATA_DIR) : [];
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ dataDir: DATA_DIR, files }));
        return;
    }

    // POST /api/chat - TWO contracts
    if (cleanPath === '/api/chat' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            let systemPrompt, messages;
            if (body.messages && body.systemPrompt) {
                systemPrompt = body.systemPrompt;
                messages = body.messages;
            } else {
                const kb = body.knowledgeBase || '';
                systemPrompt = `You are a helpful knowledge base assistant. Use ONLY the following knowledge base to answer questions. If the answer is not in the knowledge base, say so.\n\n${kb}`;
                messages = [];
                if (body.history) { body.history.forEach(h => messages.push({role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content})); }
                messages.push({role: 'user', content: body.message});
            }
            const result = await callGemini(systemPrompt, messages);
            res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        } catch(e) {
            res.writeHead(500, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
        return;
    }

    // POST /api/feedback/questions
    if (cleanPath === '/api/feedback/questions' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const prompt = `Given this user feedback about a knowledge base:\n\nFeedback: "${body.feedback}"\n\nKnowledge Base:\n${body.knowledgeBase}\n\nGenerate exactly 3 clarifying questions to better understand what changes the user wants. Return as JSON array of strings.`;
            const result = await callGemini('You generate clarifying questions for KB feedback. Return ONLY a JSON array of 3 strings.', [{role:'user',content:prompt}]);
            let questions;
            try { questions = JSON.parse(result.response.replace(/```json?\n?/g,'').replace(/```/g,'').trim()); } catch(e) { questions = [result.response]; }
            res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify({questions}));
        } catch(e) {
            res.writeHead(500, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
        return;
    }

    // POST /api/feedback/summarize
    if (cleanPath === '/api/feedback/summarize' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const qaPairs = body.questions.map((q,i) => `Q: ${q}\nA: ${body.answers[i]||'No answer'}`).join('\n\n');
            const prompt = `Summarize this feedback into a clear, actionable proposal for updating the knowledge base.\n\nOriginal Feedback: "${body.feedback}"\n\nClarifying Q&A:\n${qaPairs}\n\nKnowledge Base:\n${body.knowledgeBase}\n\nWrite a concise summary of the proposed change.`;
            const result = await callGemini('You summarize feedback into KB change proposals.', [{role:'user',content:prompt}]);
            res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify({summary: result.response}));
        } catch(e) {
            res.writeHead(500, {...corsHeaders, 'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: e.message}));
        }
        return;
    }

    // GET /api/feedback/queue
    if (cleanPath === '/api/feedback/queue' && req.method === 'GET') {
        let queue = [];
        try { queue = JSON.parse(fs.readFileSync(FEEDBACK_QUEUE_PATH, 'utf8')); } catch(e) {}
        res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
        res.end(JSON.stringify({queue}));
        return;
    }

    // POST /api/feedback/queue
    if (cleanPath === '/api/feedback/queue' && req.method === 'POST') {
        const body = await parseBody(req);
        let queue = [];
        try { queue = JSON.parse(fs.readFileSync(FEEDBACK_QUEUE_PATH, 'utf8')); } catch(e) {}
        queue.push({...body, status: 'pending', timestamp: new Date().toISOString()});
        fs.writeFileSync(FEEDBACK_QUEUE_PATH, JSON.stringify(queue, null, 4));
        res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'ok'}));
        return;
    }

    // DELETE /api/feedback/queue/:id
    if (cleanPath.startsWith('/api/feedback/queue/') && req.method === 'DELETE') {
        const id = cleanPath.split('/').pop();
        let queue = [];
        try { queue = JSON.parse(fs.readFileSync(FEEDBACK_QUEUE_PATH, 'utf8')); } catch(e) {}
        queue = queue.filter(item => item.id !== id);
        fs.writeFileSync(FEEDBACK_QUEUE_PATH, JSON.stringify(queue, null, 4));
        res.writeHead(200, {...corsHeaders, 'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'ok'}));
        return;
    }

    // POST /api/feedback/apply
    if (cleanPath === '/api/feedback/apply' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            let queue = JSON.parse(fs.readFileSync(FEEDBACK_QUEUE_PATH, 'utf8'));
            const item = queue.find(i => i.id === body.feedbackId);
            if (!item) { res.writeHead(404, {...corsHeaders, 'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Not found'})); return; }
            const currentKB = fs.existsSync(KB_PATH) ? fs.readFileSync(KB_PATH, 'utf8') : '';
            const prompt = `Apply this change to the knowledge base:\n\nProposed Change: ${item.summary}\n\nCurrent Knowledge Base:\n${currentKB}\n\nReturn the COMPLETE updated knowledge base content.`;
            const result = await callGemini('You update knowledge bases. Return ONLY the full updated KB content, no explanations.', [{role:'user',content:prompt}]);
            const updatedKB = result.response;
            const versionId = Date.now().toString();
            const prevFile = `previous_${versionId}.md`;
            const snapFile = `snapshot_${versionId}.md`;
            fs.writeFileSync(path.join(SNAPSHOTS_DIR, prevFile), currentKB);
            fs.writeFileSync(path.join(SNAPSHOTS_DIR, snapFile), updatedKB);
            fs.writeFileSync(KB_PATH, updatedKB);
            let versions = []; try { versions = JSON.parse(fs.readFileSync(KB_VERSIONS_PATH, 'utf8')); } catch(e) {}
            versions.push({id: versionId, timestamp: new Date().toISOString(), snapshotFile: snapFile, previousFile: prevFile, changes: [item.summary]});
            fs.writeFileSync(KB_VERSIONS_PATH, JSON.stringify(versions, null, 4));
            item.status = 'applied';
            fs.writeFileSync(FEEDBACK_QUEUE_PATH, JSON.stringify(queue, null, 4));
            res.writeHead(200, {...corsHeaders, 'Content-Type':'application/json'});
            res.end(JSON.stringify({success: true, content: updatedKB}));
        } catch(e) { res.writeHead(500, {...corsHeaders, 'Content-Type':'application/json'}); res.end(JSON.stringify({error: e.message})); }
        return;
    }

    // GET /api/kb/content
    if (cleanPath === '/api/kb/content' && req.method === 'GET') {
        try {
            const versionId = parsedUrl.query.versionId;
            let content;
            if (versionId) {
                let versions = JSON.parse(fs.readFileSync(KB_VERSIONS_PATH, 'utf8'));
                const ver = versions.find(v => v.id === versionId);
                content = ver ? fs.readFileSync(path.join(SNAPSHOTS_DIR, ver.snapshotFile), 'utf8') : '';
            } else {
                content = fs.existsSync(KB_PATH) ? fs.readFileSync(KB_PATH, 'utf8') : '';
            }
            res.writeHead(200, {...corsHeaders, 'Content-Type':'application/json'});
            res.end(JSON.stringify({content}));
        } catch(e) { res.writeHead(500, {...corsHeaders, 'Content-Type':'application/json'}); res.end(JSON.stringify({error: e.message})); }
        return;
    }

    // GET /api/kb/versions
    if (cleanPath === '/api/kb/versions' && req.method === 'GET') {
        let versions = []; try { versions = JSON.parse(fs.readFileSync(KB_VERSIONS_PATH, 'utf8')); } catch(e) {}
        res.writeHead(200, {...corsHeaders, 'Content-Type':'application/json'});
        res.end(JSON.stringify({versions}));
        return;
    }

    // GET /api/kb/snapshot/:filename
    if (cleanPath.startsWith('/api/kb/snapshot/') && req.method === 'GET') {
        const filename = cleanPath.split('/').pop();
        const filePath = path.join(SNAPSHOTS_DIR, filename);
        if (fs.existsSync(filePath)) {
            res.writeHead(200, {...corsHeaders, 'Content-Type':'text/markdown'});
            res.end(fs.readFileSync(filePath, 'utf8'));
        } else { res.writeHead(404, corsHeaders); res.end('Not found'); }
        return;
    }

    // POST /api/kb/update
    if (cleanPath === '/api/kb/update' && req.method === 'POST') {
        const body = await parseBody(req);
        fs.writeFileSync(KB_PATH, body.content || '');
        res.writeHead(200, {...corsHeaders, 'Content-Type':'application/json'});
        res.end(JSON.stringify({status: 'ok'}));
        return;
    }

    // Static file serving
    let filePath = path.join(PUBLIC_DIR, cleanPath === '/' ? 'index.html' : cleanPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, {...corsHeaders, 'Content-Type': contentType});
        fs.createReadStream(filePath).pipe(res);
    } else {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.writeHead(200, {...corsHeaders, 'Content-Type': 'text/html'});
            fs.createReadStream(indexPath).pipe(res);
        } else {
            res.writeHead(404, corsHeaders);
            res.end('Not found');
        }
    }
});


server.listen(PORT, '0.0.0.0', () => {
    console.log(`HSBC Smart Service Management server running on port ${PORT}`);
    // Auto-run simulations on startup so dashboard has data immediately
    const startupScripts = [
        { file: 'SSM_001.cjs', id: 'CSC-2026-0309-AON-0847' },
        { file: 'SSM_002.cjs', id: 'CSC-2026-0309-CC-0291' },
        { file: 'SSM_003.cjs', id: 'CSC-2026-0309-HSF-0314' }
    ];
    let delay = 0;
    startupScripts.forEach(script => {
        setTimeout(() => {
            const scriptPath = path.join(__dirname, 'simulation_scripts', script.file);
            const child = exec(`node "${scriptPath}" > "${scriptPath}.log" 2>&1`, (error) => {
                if (error && error.code !== 0) console.error(`${script.file} startup error:`, error.message);
                runningProcesses.delete(script.id);
            });
            runningProcesses.set(script.id, child);
            console.log(`Auto-started ${script.file}`);
        }, delay * 1000);
        delay += 2;
    });
});
