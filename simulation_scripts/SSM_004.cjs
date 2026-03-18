const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public/data');
const PROCESSES_FILE = path.join(PUBLIC_DATA_DIR, 'processes.json');
const PROCESS_ID = "CSC-2026-0322-DLA-0193";
const CASE_NAME = "Programme Bulk Service Request — 3 Parallel Requests";

// --- Helpers ---
const readJson = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []);
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 4));
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateProcessLog = (processId, logEntry, keyDetailsUpdate = {}) => {
    const processFile = path.join(PUBLIC_DATA_DIR, `process_${processId}.json`);
    let data = { logs: [], keyDetails: {}, sidebarArtifacts: [] };
    if (fs.existsSync(processFile)) data = readJson(processFile);

    if (logEntry) {
        const existingIdx = logEntry.id ? data.logs.findIndex(l => l.id === logEntry.id) : -1;
        if (existingIdx !== -1) {
            data.logs[existingIdx] = { ...data.logs[existingIdx], ...logEntry };
        } else {
            data.logs.push(logEntry);
        }
    }

    if (keyDetailsUpdate && Object.keys(keyDetailsUpdate).length > 0) {
        data.keyDetails = { ...data.keyDetails, ...keyDetailsUpdate };
    }
    writeJson(processFile, data);
};

const updateProcessListStatus = async (processId, status, currentStatus) => {
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001';
    try {
        const response = await fetch(`${apiUrl}/api/update-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: processId, status, currentStatus })
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
    } catch (e) {
        try {
            const processes = JSON.parse(fs.readFileSync(PROCESSES_FILE, 'utf8'));
            const idx = processes.findIndex(p => p.id === String(processId));
            if (idx !== -1) {
                processes[idx].status = status;
                processes[idx].currentStatus = currentStatus;
                fs.writeFileSync(PROCESSES_FILE, JSON.stringify(processes, null, 4));
            }
        } catch (err) { }
    }
};

const waitForEmail = async (caseId) => {
    console.log(`Waiting for SM to send email for case ${caseId}...`);
    const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

    try {
        await fetch(`${API_URL}/email-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sent: false, caseId })
        });
    } catch (e) {
        console.error("Failed to reset email status", e);
    }

    while (true) {
        try {
            const response = await fetch(`${API_URL}/email-status?caseId=${encodeURIComponent(caseId)}`);
            if (response.ok) {
                const { sent } = await response.json();
                if (sent) {
                    console.log(`Email Sent by SM for case ${caseId}!`);
                    return true;
                }
            }
        } catch (e) { }
        await delay(2000);
    }
};


(async () => {
    console.log(`Starting ${PROCESS_ID}: ${CASE_NAME}...`);

    // Initialize process log with key details — script overwrites on reset
    writeJson(path.join(PUBLIC_DATA_DIR, `process_${PROCESS_ID}.json`), {
        logs: [],
        keyDetails: {
            "Client": "DLA Piper LLP (Global)",
            "PA": "Rachel Thornton • Global Programme Administrator",
            "Programme": "DLA-UK-CC-2024",
            "SM Assigned": "David Mensah",
            "Request Type": "Bulk Programme Request (3 parallel)",
            "Voice Note": "Transcribed & parsed on intake",
            "Requests": "R1: Credit limit increase (departing employee) • R2: New cardholder onboarding • R3: Bulk statement for auditors"
        }
    });

    const steps = [
        {
            id: "step-1",
            title_p: "Receiving and parsing inbound email and voice note from PA...",
            title_s: "Email & Voice Note Received — 3 Requests Extracted",
            reasoning: [
                "Inbound email received from rachel.thornton@dlapiper.com to the HSBC Commercial Cards service mailbox at 09:01:04 GMT.",
                "Sender domain verified as dlapiper.com — matched to programme DLA-UK-CC-2024. SM assigned: David Mensah.",
                "Email body contained a 47-second voice note attachment. Pace transcribed the voice note using speech-to-text in parallel with reading the email body.",
                "Three distinct requests identified: R1 — emergency credit limit reduction from GBP 15,000 to GBP 0 for departing employee James Whitfield (card ****7823); R2 — new cardholder onboarding for incoming associate Sofia Reyes (Spanish speaker, Madrid office); R3 — bulk statement export (January–March 2026) for 14 cardholders, required by external auditors by 17:00 GMT today.",
                "All three requests confirmed as within PA authority scope under programme policy POL-DLA-UK-2024. Three parallel workstreams initialised at 09:01:09 GMT."
            ],
            artifacts: [{
                id: "art-01",
                type: "email_draft",
                label: "Inbound Email — Rachel Thornton",
                data: {
                    from: "rachel.thornton@dlapiper.com",
                    to: "hsbc.commercialcards.uk@hsbc.com",
                    subject: "Urgent — 3 things on the DLA programme",
                    isIncoming: true,
                    body: "Hi HSBC,\n\nSorry for the early message — three things that need sorting today, one is quite urgent.\n\n1. James Whitfield (card ending 7823) is leaving DLA at close of business today. His card needs to be reduced to zero immediately and cancelled by end of day. I've attached a voice note explaining the situation — he has an outstanding travel booking on the card we need to handle carefully.\n\n2. We have a new associate starting in our Madrid office next week — Sofia Reyes. She'll need a card set up under the standard associate limit. Her preferred language is Spanish so please set up her welcome comms in Spanish if possible.\n\n3. Our external auditors (Grant Thornton) are in today and need a bulk statement export for all 14 cardholders covering January to March 2026. They need it by 5pm today in Excel format.\n\nPlease let me know if you need anything.\n\nMany thanks,\nRachel\n\n--\nRachel Thornton\nGlobal Programme Administrator | DLA Piper LLP\nrachel.thornton@dlapiper.com | +44 20 7153 7000 ext. 3241"
                }
            }]
        },
        {
            id: "step-2a",
            title_p: "R1 • Locating James Whitfield card profile and assessing policy...",
            title_s: "R1 • Card Profile Located — Emergency Limit Reduction Assessed",
            parallel: true,
            thread: "R1: Departing Employee",
            reasoning: [
                "Pace queried the HSBC CRM for James Whitfield under programme DLA-UK-CC-2024.",
                "Card ****7823 confirmed: active, current limit GBP 15,000, outstanding balance GBP 4,240.00. Last transaction: Eurostar London–Paris, GBP 380.00 on 2026-03-20.",
                "Voice note transcribed: Rachel states James has an approved travel booking (Paris trip, returns 24 March) on the card and requests the limit be set to GBP 5,000 temporarily to cover the return journey, then cancelled on his return date.",
                "Policy check: POL-DLA-UK-2024 Section 7.2 — departing employee limit reduction requires SM sign-off when outstanding balance exceeds GBP 3,000. Balance is GBP 4,240 — SM approval required.",
                "Pace flagged for HITL: limit reduction to GBP 5,000 (not GBP 0) with cancellation queued for 24 March. Draft response prepared for SM David Mensah review."
            ],
            artifacts: [{
                id: "art-02a",
                type: "file",
                label: "CRM Card Profile — James Whitfield",
                pdfPath: "/data/CRM_Programme_Summary.pdf"
            }]
        },
        {
            id: "step-2b",
            title_p: "R2 • Creating new cardholder record for Sofia Reyes...",
            title_s: "R2 • New Cardholder Onboarded — Welcome Email Sent in Spanish",
            parallel: true,
            thread: "R2: New Cardholder",
            reasoning: [
                "Pace retrieved the new cardholder request from the email: Sofia Reyes, Madrid office, associate grade, preferred language Spanish.",
                "Cardholder record created in MiVision: card limit set to GBP 5,000 (standard associate level per POL-DLA-UK-2024 Section 3.1). Card number ending ****2291 assigned.",
                "Programme policy review: PA Rachel Thornton has authority to onboard associates up to GBP 7,500 limit — no SM sign-off needed.",
                "Welcome email drafted in Spanish per language preference. Email sent to sofia.reyes@dlapiper.com at 09:01:44 GMT with card activation instructions and PIN set-up link.",
                "Cardholder record active. Onboarding reference: ONB-2026-0322-DLA-2291."
            ],
            artifacts: [
                {
                    id: "art-02b1",
                    type: "file",
                    label: "MiVision — New Cardholder Record",
                    pdfPath: "/data/MiVision_Changes_Confirmation.pdf"
                },
                {
                    id: "art-02b2",
                    type: "email_draft",
                    label: "Welcome Email — Sofia Reyes (Spanish)",
                    data: {
                        from: "pace.servicehub@hsbc.com",
                        to: "sofia.reyes@dlapiper.com",
                        cc: "rachel.thornton@dlapiper.com",
                        subject: "Bienvenida a HSBC Commercial Cards — Su nueva tarjeta corporativa",
                        isSent: true,
                        body: "Estimada Sofia,\n\nBienvenida a DLA Piper. Le escribimos desde HSBC Commercial Cards para confirmar que su nueva tarjeta corporativa ha sido configurada y está lista para activarse.\n\nDETALLES DE SU TARJETA\n────────────────────────────────────────\nNúmero de tarjeta: •••• •••• •••• 2291\nLímite de crédito: GBP 5.000\nPrograma: DLA-UK-CC-2024\nReferencia de alta: ONB-2026-0322-DLA-2291\n────────────────────────────────────────\n\nPara activar su tarjeta y establecer su PIN, haga clic en el siguiente enlace seguro en las próximas 48 horas:\n\n[Enlace de activación — expira el 24 de marzo de 2026]\n\nSi tiene alguna pregunta, no dude en ponerse en contacto con nuestro equipo:\nhsbc.commercialcards.uk@hsbc.com\n\nAtentamente,\n\nHSBC Commercial Cards — Pace Service Hub\nEn nombre de: David Mensah, Senior Card Consultant\nHSBC Bank plc | 8 Canada Square, London E14 5HQ"
                    }
                }
            ]
        },
        {
            id: "step-2c",
            title_p: "R3 • Querying Smart Data for bulk statement — 14 cardholders...",
            title_s: "R3 • Bulk Statement Generated — 14 Cardholders, Jan–Mar 2026",
            parallel: true,
            thread: "R3: Auditor Statement",
            reasoning: [
                "Pace queried Mastercard Smart Data OnLine™ for all 14 active cardholders under programme DLA-UK-CC-2024.",
                "Date range: 1 January 2026 – 31 March 2026. All 14 cardholder records confirmed active.",
                "Query returned: 612 transactions across 14 cardholders, total programme spend GBP 187,340.20. Level 3 data available on 81% of transactions.",
                "Report formatted to Grant Thornton's requested Excel template: individual cardholder tabs, combined summary tab, merchant-category breakdown, GL codes.",
                "Output file: DLA_BulkStatement_Q1_2026_GrantThornton.xlsx — generated at 09:02:11 GMT. Ready for SM attachment and delivery.",
                "Delivery deadline: 17:00 GMT today. Statement generated with 7 hours 58 minutes to spare."
            ],
            artifacts: [
                {
                    id: "art-02c1",
                    type: "file",
                    label: "Bulk Statement — 14 Cardholders Q1 2026",
                    pdfPath: "/data/Q1_Spend_Report_Sophia_Chen.pdf"
                },
                {
                    id: "art-02c2",
                    type: "video",
                    label: "Smart Data Browser Recording",
                    videoPath: "/data/Smart_Data_Browser_Recording.webm"
                }
            ]
        },
        {
            id: "step-3",
            title_p: "Preparing draft response for SM review — R1 requires sign-off...",
            title_s: "SM Review Required — R1 Limit Reduction Needs Sign-Off",
            reasoning: [
                "R2 (new cardholder) and R3 (bulk statement) completed autonomously at 09:02:11 GMT — both within PA authority, no SM intervention required.",
                "R1 (James Whitfield limit reduction) flagged for SM review: outstanding balance GBP 4,240 exceeds the GBP 3,000 threshold requiring SM sign-off per POL-DLA-UK-2024 Section 7.2.",
                "Pace's recommendation: set limit to GBP 5,000 temporarily (covers Paris return travel, GBP 380 outstanding booking), schedule cancellation for 24 March 2026 on Whitfield's return. This matches Rachel's voice note instruction.",
                "Draft client response prepared covering all three requests. R2 and R3 sections complete. R1 section pending SM confirmation of recommended approach.",
                "SM David Mensah: please review R1 recommendation and send the draft to Rachel Thornton."
            ],
            artifacts: [
                {
                    id: "art-03a",
                    type: "email_draft",
                    label: "Draft Response — Rachel Thornton (3 Requests)",
                    data: {
                        from: "d.mensah@hsbc.com",
                        to: "rachel.thornton@dlapiper.com",
                        subject: "RE: Urgent — 3 things on the DLA programme",
                        isIncoming: false,
                        isSent: false,
                        body: "Hi Rachel,\n\nAll three sorted — details below.\n\n────────────────────────────────────────────────\nR1 — JAMES WHITFIELD (card ****7823)\n────────────────────────────────────────────────\n\nAs per your voice note, James has an outstanding Paris return booking on the card. We've set his limit to GBP 5,000 temporarily to ensure the travel booking completes without issue. The card is scheduled for full cancellation on 24 March 2026 on his return.\n\n  • Limit: GBP 15,000 → GBP 5,000 (temporary, effective now)\n  • Cancellation: scheduled 24 March 2026\n  • Ref: LIM-2026-0322-78231\n\nIf the return date changes, just let us know and we'll adjust accordingly.\n\n────────────────────────────────────────────────\nR2 — SOFIA REYES ONBOARDING\n────────────────────────────────────────────────\n\nSofia's card is set up and ready to go:\n\n  • Card: •••• •••• •••• 2291\n  • Limit: GBP 5,000 (standard associate)\n  • Welcome email: sent in Spanish to sofia.reyes@dlapiper.com\n  • Ref: ONB-2026-0322-DLA-2291\n\nShe'll receive activation instructions and a PIN set-up link valid for 48 hours.\n\n────────────────────────────────────────────────\nR3 — AUDITOR BULK STATEMENT\n────────────────────────────────────────────────\n\nPlease find attached the Q1 2026 bulk statement for all 14 DLA Piper cardholders, formatted to Grant Thornton's template:\n\n  • Period: 1 January – 31 March 2026\n  • Cardholders: 14\n  • Transactions: 612\n  • Total spend: GBP 187,340.20\n  • Format: Excel (cardholder tabs + summary + merchant breakdown)\n\nPlease forward to your Grant Thornton contact — well ahead of the 17:00 deadline.\n\n────────────────────────────────────────────────\n\nLet me know if anything needs adjusting.\n\nKind regards,\n\nDavid Mensah\nSenior Card Consultant | HSBC Commercial Cards\nd.mensah@hsbc.com | +44 20 7991 8847\nHSBC Bank plc | 8 Canada Square, London E14 5HQ"
                    }
                },
                {
                    id: "art-03b",
                    type: "file",
                    label: "Bulk Statement — Q1 2026 (Attachment)",
                    pdfPath: "/data/Q1_Spend_Report_Sophia_Chen.pdf"
                }
            ],
            isHitl: true
        }
    ];

    // --- Main Execution Loop ---
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const isFinal = i === steps.length - 1;

        // Processing state
        updateProcessLog(PROCESS_ID, {
            id: step.id,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: step.title_p,
            status: "processing",
            ...(step.thread ? { thread: step.thread } : {})
        });
        await updateProcessListStatus(PROCESS_ID, "In Progress", step.title_p);
        await delay(2000 + Math.random() * 500);

        if (step.isHitl) {
            // HITL: pause at warning, wait for SM to click Send
            updateProcessLog(PROCESS_ID, {
                id: step.id,
                title: step.title_s,
                status: "warning",
                reasoning: step.reasoning || [],
                artifacts: step.artifacts || [],
                ...(step.thread ? { thread: step.thread } : {})
            });
            await updateProcessListStatus(PROCESS_ID, "Needs Review", "Draft Review: Awaiting SM Sign-Off");

            await waitForEmail(PROCESS_ID);

            // SM sent — mark complete
            updateProcessLog(PROCESS_ID, {
                id: step.id,
                title: step.title_s,
                status: "completed",
                reasoning: step.reasoning || [],
                artifacts: step.artifacts || [],
                ...(step.thread ? { thread: step.thread } : {})
            });
            await updateProcessListStatus(PROCESS_ID, "Done", "All 3 requests resolved — email sent to PA");
            await delay(1500);
        } else {
            // Normal step: success
            updateProcessLog(PROCESS_ID, {
                id: step.id,
                title: step.title_s,
                status: isFinal ? "completed" : "success",
                reasoning: step.reasoning || [],
                artifacts: step.artifacts || [],
                ...(step.thread ? { thread: step.thread } : {})
            });
            await updateProcessListStatus(PROCESS_ID, "In Progress", step.title_s);
            await delay(1500);
        }
    }

    console.log(`${PROCESS_ID} Complete: ${CASE_NAME}`);
})();
