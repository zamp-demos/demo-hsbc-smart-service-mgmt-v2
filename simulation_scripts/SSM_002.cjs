const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public/data');
const PROCESSES_FILE = path.join(PUBLIC_DATA_DIR, 'processes.json');
const PROCESS_ID = "CSC-2026-0309-CC-0291";
const CASE_NAME = "Routine Limit Increase Uncovers an Unactioned Fraud Alert";

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
 fs.writeFileSync(PROCESSES_FILE, JSON.stringify(processes, null, 4));
 }
 } catch (err) { }
 }
};

const waitForSignal = async (signalKey) => {
 console.log(`Waiting for signal: ${signalKey}...`);
 const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
 while (true) {
 try {
 const response = await fetch(`${API_URL}/signal-status`);
 if (response.ok) {
 const signals = await response.json();
 if (signals[signalKey]) {
 console.log(`Signal received: ${signalKey}`);
 return true;
 }
 }
 } catch (e) { }
 await delay(2000);
 }
};

(async () => {
 console.log(`Starting ${PROCESS_ID}: ${CASE_NAME}...`);

 // Initialize process log with key details
 writeJson(path.join(PUBLIC_DATA_DIR, `process_${PROCESS_ID}.json`), {
 logs: [],
 keyDetails: {
 "Client": "Clifford Chance LLP (UK)",
 "Cardholder": "Richard Okafor ••••7732",
 "Role": "Senior Associate, Corporate M&A",
 "Programme Administrator": "James Whitworth",
 "Request Type": "Limit Increase (Possible Fraud)",
 "SM Assigned": "Sarah Okonkwo",
 "Programme": "CC-PROG-UK-0112",
  }
 });

 await updateProcessListStatus(PROCESS_ID, "In Progress", "Inbound email received — beginning triage");

 const steps = [
 {
 id: "step-1",
 title_p: "Receiving and parsing inbound email from PA...",
 title_s: "Email Received & Request Extracted",
 reasoning: [
 "Inbound email received from james.holroyd@cliffordchance.com at 10:08:44 GMT.",
 "Sender domain verified against Clifford Chance LLP programme.",
 "One request identified: temporary limit increase from GBP 20,000 to GBP 45,000 for card ****7732.",
 "Stated purpose: Microsoft Azure cloud licensing ~GBP 38,000.",
 "Case CSC-2026-0309-CC-0291 created and assigned to SM Sarah Okonkwo."
 ],
 artifacts: [{
 id: "art-01",
 type: "email_draft",
 label: "Inbound Email James Holroyd",
 data: {
 from: "James Holroyd <james.holroyd@cliffordchance.com>",
 to: "HSBC Commercial Cards <hsbc.commercialcards.uk@hsbc.com>",
 subject: "Temporary limit increase — Richard Okafor, card 7732",
 body: "Hi,\n\nCould you please arrange a temporary increase on Richard Okafor's card (ending 7732) from GBP 20,000 to GBP 45,000?\n\nHe's leading our Microsoft Azure cloud migration project and we have a GBP 38,000 software licensing invoice coming up from Microsoft UK next week. We need the headroom in place before the invoice is processed.\n\nHappy to provide any documentation you need.\n\nThanks,\nJames Holroyd\nCommercial Cards Programme Administrator\nClifford Chance LLP | 10 Upper Bank Street, London E14 5JJ\nT: +44 20 7006 1000 | james.holroyd@cliffordchance.com",
 isIncoming: true
 }
 }]
 },
 {
 id: "step-2",
 title_p: "Querying CRM for PA identity and programme details...",
 title_s: "PA Identity & Programme Verified",
 reasoning: [
 "CRM query for james.holroyd@cliffordchance.com returned verified PA record.",
 "Programme CC-PROG-UK-0112 confirmed — Clifford Chance LLP.",
 "SM assigned: Sarah Okonkwo.",
 "Cardholder Richard Okafor, Head of Technology, P-Card ****7732, status: active.",
 "Programme policy POL-CC-UK-2026 loaded — SM approval required for limit amendments between GBP 35,001 and GBP 60,000."
 ],
 artifacts: [{
 id: "art-02",
 type: "file",
 label: "CRM Programme Summary",
 pdfPath: "/data/Case2_CRM_Programme_Summary.pdf"
 }]
 },
 {
 id: "step-3",
 title_p: "Accessing MiVision to check cardholder profile and card status...",
 title_s: "Cardholder Profile Checked — Flag Detected",
 reasoning: [
 "MiVision profile retrieved for Richard Okafor, card ****7732.",
 "Card status: active. Current limit: GBP 20,000. MTD balance: GBP 17,840 (89.2% utilised).",
 " INTERNAL FLAG DETECTED: \"Account flagged for review — see linked alert.\"",
 "Alert reference: SAS-2026-0307-77321.",
 "Policy Section 6.1.4: no limit amendment may be processed while a fraud alert remains active on the account. This is a HARD BLOCK.",
 "Two holds now in effect: (1) fraud alert policy block, (2) threshold breach (MTD >85%)."
 ],
 artifacts: [
 {
 id: "art-03",
 type: "file",
 label: "MiVision Cardholder Profile",
 pdfPath: "/data/Case2_MiVision_Cardholder_Profile.pdf"
 },
 {
 id: "art-04",
 type: "video",
 label: "MiVision Browser Recording",
 videoPath: "/data/Case2_MiVision_Browser_Recording.webm"
 }
 ]
 },
 {
 id: "step-4",
 title_p: "Filing Fraud Data Access Request and querying Auth Platform in parallel...",
 title_s: "Fraud Data Access Requested & Auth Platform Queried",
 reasoning: [
 "SAS Fraud Management access restricted — Fraud Data Access Request (FDAR) required.",
 "FDAR filed: read-only access, card ****7732, urgency HIGH, POCA compliance noted. Ticket: FDAR-2026-0309-0441.",
 "Notification sent to fraudops.dutymanager@hsbc.com.",
 "In parallel: Auth Platform queried for recent transactions on card ****7732.",
 "Three MCC 5065 (Electronic Parts & Equipment) transactions identified — GBP 2,840 TECHPOINT SUPPLIES LTD (2 Mar, 19:22), GBP 3,120 TECHPOINT SUPPLIES LTD (5 Mar, 20:41), GBP 2,940 SIGMA ELECTRONICS TRADE (7 Mar, 21:08).",
 "Total: GBP 8,900. All transactions occurred outside normal business hours with new merchants not previously used by this cardholder."
 ],
 artifacts: [
 {
 id: "art-05",
 type: "file",
 label: "FDAR Submission Confirmation",
 pdfPath: "/data/Case2_FDAR_Submission_Confirmation.pdf"
 },
 {
 id: "art-06",
 type: "email_draft",
 label: "FDAR Notification Email",
 data: {
 from: "HSBC Commercial Cards — Pace Service Hub <pace.servicehub@hsbc.com>",
 to: "HSBC Fraud Operations — Duty Manager <fraudops.dutymanager@hsbc.com>",
 cc: "Sarah Okonkwo <s.okonkwo@hsbc.com>",
 subject: "[HIGH] FDAR-2026-0309-0441 — Fraud alert access required — card ••••7732 — limit request pending",
 body: "A Fraud Data Access Request has been submitted by the HSBC Commercial Cards Service Hub (Pace) in connection with an inbound PA limit amendment for Clifford Chance LLP.\n\nREQUEST DETAILS\n───────────────────────────────────────────────────\nFDAR Ticket: FDAR-2026-0309-0441\nCard: ••••7732 — Richard Okafor\nProgramme: CC-PROG-UK-0112 — Clifford Chance LLP\nSM Assigned: Sarah Okonkwo\nFiled At: 2026-03-09 10:08:58 GMT\nUrgency: HIGH\n───────────────────────────────────────────────────\n\nREASON FOR REQUEST:\nProgramme policy (POL-CC-UK-2026, Section 6.1.4) requires fraud alert status to be reviewed and cleared by Fraud Operations before a limit amendment can be processed. MiVision shows an active internal flag on account ••••7732. A PA limit increase request for this card is currently pending.\n\nACCESS REQUESTED:\nType: Read-only — Fraud alert records for card ••••7732\nAuthority: HSBC Internal Fraud Investigation Policy (IFI-POL-2023)\nScope: All open and recent alerts on card ••••7732\nPOCA Note: Read-only access only. No client notification will be made pending your review.\n\nPlease approve or escalate within SLA (same-day priority — active cardholder request pending). FDAR ticket: FDAR-2026-0309-0441.\n\nHSBC Commercial Cards — Pace Service Hub (automated)\nOn behalf of: Sarah Okonkwo, Senior Card Consultant\ns.okonkwo@hsbc.com | HSBC Bank plc | Commercial Banking",
 isSent: true
 }
 },
 {
 id: "art-07",
 type: "file",
 label: "Auth Platform Transaction Records",
 pdfPath: "/data/Case2_Auth_Platform_Transaction_Records.pdf"
 }
 ]
 },
 {
 id: "step-5",
 title_p: "FDAR approval received — accessing SAS Fraud Management...",
 title_s: "FDAR Approved & Fraud Alert Retrieved",
 reasoning: [
 "FDAR-2026-0309-0441 approved by T. Osei, Fraud Operations Duty Manager, at 10:14:19 GMT — 5 minutes 21 seconds after submission.",
 "Read-only access granted with a 4-hour session window.",
 "SAS Fraud Management accessed. Alert SAS-2026-0307-77321 retrieved.",
 "Status: Open. Score: 74/100 (block threshold: 85). Created 07-Mar-2026 23:14 GMT — 48 hours unactioned.",
 "Alert unassigned in Fraud Operations queue.",
 "Three triggers active: (1) new MCC 5065 — first activity in this merchant category, (2) off-hours transaction pattern — all between 19:00-21:30 GMT, (3) high MTD velocity — 117% above 6-month rolling average."
 ],
 artifacts: [
 {
 id: "art-08",
 type: "email_draft",
 label: "FDAR Approval Email",
 data: {
 from: "T. Osei — HSBC Fraud Operations <t.osei@hsbc.com>",
 to: "HSBC Commercial Cards — Pace Service Hub <pace.servicehub@hsbc.com>",
 cc: "Sarah Okonkwo <s.okonkwo@hsbc.com>",
 subject: "RE: [HIGH] FDAR-2026-0309-0441 — Fraud alert access required — card ••••7732 — limit request pending",
 body: "Approved.\n\nFDAR-2026-0309-0441 — Read-only access granted.\n\nDetails:\n Card: ••••7732 — Richard Okafor\n Scope: All open and recent SAS alerts on card ••••7732\n Session: 4-hour read-only window from time of approval\n Audit log: Recorded under FDAR-2026-0309-0441\n Approved By: T. Osei, Fraud Operations Duty Manager\n Approved At: 2026-03-09 10:14:19 GMT\n\nNote: Alert SAS-2026-0307-77321 is currently in the queue. We are aware. Your notification has expedited our review.\n\nT. Osei\nFraud Operations Duty Manager — HSBC UK\nt.osei@hsbc.com | Internal: x4892",
 isIncoming: true
 }
 },
 {
 id: "art-09",
 type: "file",
 label: "SAS Alert Record",
 pdfPath: "/data/Case2_SAS_Alert_Record.pdf"
 },
 {
 id: "art-10",
 type: "video",
 label: "SAS Browser Recording",
 videoPath: "/data/Case2_SAS_Browser_Recording.webm"
 }
 ]
 },
 {
 id: "step-6",
 title_p: "Querying CRM for related cases and SM activity...",
 title_s: "CRM Checked — Alert Queue Gap Confirmed",
 reasoning: [
 "CRM queried for Clifford Chance LLP, card ****7732, last 30 days.",
 "No open cases found. No SM notes or correspondence logged.",
 "No Fraud Operations case exists for alert SAS-2026-0307-77321.",
 "Process gap confirmed: alert has been in the Fraud Operations queue for 48 hours without being actioned, escalated, or converted to a CRM case.",
 "SM Sarah Okonkwo was never notified.",
 "Full picture now assembled across four systems: MiVision (card profile + flag), Auth Platform (flagged transactions), SAS (fraud alert detail), CRM (gap confirmation)."
 ],
 artifacts: [{
 id: "art-11",
 type: "file",
 label: "CRM Case Check",
 pdfPath: "/data/Case2_CRM_Case_Check.pdf"
 }]
 },
 {
 id: "step-7",
 title_p: "Compiling risk assessment and preparing decision options...",
 title_s: "Risk Assessment Complete — HITL Invoked",
 reasoning: [
 "Five-factor risk assessment compiled:",
 "(1) Active fraud alert on account — hard policy block under Section 6.1.4, no limit amendment permitted.",
 "(2) Requested limit GBP 45,000 exceeds GBP 35,000 auto-approve ceiling — SM approval required regardless.",
 "(3) MCC mismatch — flagged transactions are MCC 5065 (electronic parts) but PA's stated purpose is Microsoft Azure software (MCC 7372).",
 "(4) MTD utilisation at 89.2% — compounding exposure if limit increased.",
 "(5) 48-hour alert queue gap — internal process failure, Fraud Ops never actioned.",
 "This is a novel pattern — Pace has no prior encounter with a limit request intersecting an unactioned fraud alert.",
 "Human-in-the-loop invoked for SM decision."
 ],
 artifacts: [
 {
 id: "art-12",
 type: "file",
 label: "HITL Decision Prompt",
 pdfPath: "/data/Case2_HITL_Decision_Prompt.pdf"
 },
 {
 id: "art-13",
 type: "decision",
 label: "SM Decision Required",
 data: {
 question: "How should Pace proceed with this case?",
 options: [
 { value: "option_a", label: "Option A: Stand down — full manual handoff to SM and Fraud Ops", signal: "option_a" },
 { value: "option_b", label: "Option B: Hold limit, escalate fraud alert, send holding response to PA (Recommended)", signal: "option_b" },
 { value: "option_c", label: "Option C: Decline limit request and notify PA immediately (Risk: POCA tipping-off)", signal: "option_c" }
 ]
 }
 }
 ],
 waitForSignal: "option_b"
 },
 {
 id: "step-8",
 title_p: "SM selected Option B — executing three parallel tracks...",
 title_s: "SM Selects Option B — Pace Executes",
 reasoning: [
 " Human-in-the-Loop — SM Sarah Okonkwo selected Option B.",
 "Response time: 8 seconds.",
 "Pace now executing three parallel tracks.",
 "Track 1: Fraud Operations notified — urgent internal notification sent to fraudops.dutymanager@hsbc.com flagging the 48-hour alert queue gap. CRM case CSC-2026-0309-CC-0291 created and linked to alert SAS-2026-0307-77321.",
 "Track 2: Holding response drafted for PA James Holroyd — acknowledges the limit request, advises a short review period, no mention of fraud alert (POCA 2002 tipping-off compliance). Draft queued for SM approval before sending.",
 "Track 3: SM priority escalation brief prepared with full investigation summary, risk assessment, and recommended next steps.",
 "All three tracks executed in 22 seconds."
 ],
 artifacts: [
 {
 id: "art-14",
 type: "email_draft",
 label: "Fraud Ops Internal Notification",
 data: {
 from: "HSBC Commercial Cards — Pace Service Hub <pace.servicehub@hsbc.com>",
 to: "HSBC Fraud Operations — Duty Manager <fraudops.dutymanager@hsbc.com>",
 cc: "Sarah Okonkwo <s.okonkwo@hsbc.com>",
 subject: "[URGENT] Alert Queue Gap — SAS-2026-0307-77321 — Card ••••7732 — 48 hours unactioned",
 body: "This is an automated internal notification from the HSBC Commercial Cards Service Hub.\n\nALERT QUEUE GAP IDENTIFIED\n───────────────────────────────────────────────────\nAlert ID: SAS-2026-0307-77321\nCard: ••••7732 — Richard Okafor, Clifford Chance LLP\nCreated: 2026-03-07 23:14 GMT\nTime Open: 48 hours (as of 2026-03-09 10:14 GMT)\nQueue Status: Fraud Operations queue — UNASSIGNED\nCRM Case: NOT created\nSM Notified: NO\n───────────────────────────────────────────────────\n\nThis alert was identified during a routine Pace investigation of a PA limit amendment request for card ••••7732. The alert has been in the Fraud Operations queue for 48 hours without being actioned, escalated, or converted to a CRM case.\n\nACTION REQUIRED:\nA CRM case has been created automatically (CSC-2026-0309-CC-0291) and linked to this alert. Please ensure the alert is reviewed and actioned urgently. The cardholder's PA has submitted a limit increase request which cannot be processed while this alert remains open.\n\nA holding response has been sent to the PA advising of a short processing delay. No details of the fraud alert have been disclosed to the PA (POCA compliance).\n\nSM Sarah Okonkwo (s.okonkwo@hsbc.com) is the assigned SM for this case.\n\nHSBC Commercial Cards — Pace Service Hub (automated)\nOn behalf of: Sarah Okonkwo, Senior Card Consultant",
 isSent: true
 }
 },
 {
 id: "art-15",
 type: "email_draft",
 label: "Holding Response Draft",
 data: {
 from: "Sarah Okonkwo — HSBC Commercial Cards <s.okonkwo@hsbc.com>",
 to: "James Holroyd <james.holroyd@cliffordchance.com>",
 subject: "RE: Temporary limit increase — Richard Okafor, card 7732",
 body: "Hi James,\n\nThank you for the request — we're processing this for Richard's card (ending 7732).\n\nWe need a short additional review period before we can confirm the limit amendment. This is a routine step for requests of this size and we want to make sure everything is in order before we proceed.\n\nWe aim to come back to you by end of business today. If the Microsoft Azure invoice timeline becomes more pressing in the meantime, please do let us know and we'll prioritise accordingly.\n\nBest regards,\n\nSarah Okonkwo\nSenior Card Consultant | HSBC Commercial Cards\ns.okonkwo@hsbc.com | +44 20 7991 4418\nHSBC Bank plc | 8 Canada Square, London E14 5HQ\n\n───────────────────────────────────────────────────\n[PACE INTERNAL NOTE — NOT FOR SENDING AS IS]\nThis response has been drafted by Pace and is pending SM approval before sending.\nThe response does not reference the fraud alert — POCA 2002 tipping-off provisions\napply while alert SAS-2026-0307-77321 is under Fraud Operations review.\nCase: CSC-2026-0309-CC-0291\n───────────────────────────────────────────────────",
 isSent: false,
 isIncoming: false
 }
 },
 {
 id: "art-16",
 type: "file",
 label: "SM Priority Escalation Brief",
 pdfPath: "/data/Case2_SM_Priority_Escalation_Brief.pdf"
 }
 ]
 },
 {
 id: "step-9",
 title_p: "Updating CRM case log and closing case...",
 title_s: "CRM Case Logged & Closed",
 reasoning: [
 "SM decision recorded: Option B — hold limit, escalate fraud alert, send holding response.",
 "CRM case CSC-2026-0309-CC-0291 updated with full action log — all steps, decisions, and artifacts recorded.",
 "Case closed — all actions complete, audit trail preserved."
 ],
 artifacts: [
 { id: "art-18", type: "file", label: "CRM Case Log", pdfPath: "/data/Case2_CRM_Case_Log.pdf" }
 ]
 }
 ];

 // --- Execute Steps ---
 for (let i = 0; i < steps.length; i++) {
 const step = steps[i];
 console.log(`Step ${i + 1}/${steps.length}: ${step.title_p}`);

 // Phase 1: Processing state
 updateProcessLog(PROCESS_ID, {
 id: step.id, step: i + 1, totalSteps: steps.length,
 title: step.title_p, status: "processing",
 reasoning: [], artifacts: step.artifacts || []
 });
 await delay(2000);

 // Phase 2: Stream reasoning lines
 for (let r = 0; r < step.reasoning.length; r++) {
 updateProcessLog(PROCESS_ID, {
 id: step.id, step: i + 1, totalSteps: steps.length,
 title: step.title_p, status: "processing",
 reasoning: step.reasoning.slice(0, r + 1), artifacts: step.artifacts || []
 });
 await delay(1200);
 }
 await delay(800);

 // Phase 3: Complete
 updateProcessLog(PROCESS_ID, {
 id: step.id, step: i + 1, totalSteps: steps.length,
 title: step.title_s, status: "complete",
 reasoning: step.reasoning, artifacts: step.artifacts || []
 });

 // HITL: wait for signal if needed
 if (step.waitForSignal) {
  await updateProcessListStatus(PROCESS_ID, "Needs Attention", "SM Decision Required");
  await waitForSignal(step.waitForSignal);
  await updateProcessListStatus(PROCESS_ID, "In Progress", "SM selected option — executing...");
 }

 await delay(1500);
 }

 // Final status: Done
 await updateProcessListStatus(PROCESS_ID, "Done", "Fraud alert escalated — card held, Fraud Ops notified");
 console.log(`${PROCESS_ID}: ${CASE_NAME} — complete (Done).`);
})();
