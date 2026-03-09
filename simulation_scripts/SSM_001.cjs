const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public/data');
const PROCESSES_FILE = path.join(PUBLIC_DATA_DIR, 'processes.json');
const PROCESS_ID = "CSC-2026-0309-AON-0847";
const CASE_NAME = "Three Requests in One Email";

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

const waitForEmail = async () => {
 console.log("Waiting for SM to send email...");
 const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

 try {
 await fetch(`${API_URL}/email-status`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ sent: false })
 });
 } catch (e) {
 console.error("Failed to reset email status", e);
 }

 while (true) {
 try {
 const response = await fetch(`${API_URL}/email-status`);
 if (response.ok) {
 const { sent } = await response.json();
 if (sent) {
 console.log("Email Sent by SM!");
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
 "Client": "Aon plc (UK)",
 "Cardholder": "Sophia Chen ••••4421",
 "Programme": "AON-UK-CC-0047",
 "SM Assigned": "David Mensah",
  }
 });

 const steps = [
 {
 id: "step-1",
 title_p: "Receiving and parsing inbound email from PA...",
 title_s: "Email Received & Requests Extracted",
 reasoning: [
 "Inbound email received from rachel.griffiths@aon.com to the HSBC Commercial Cards service mailbox at 14:03:11 GMT.",
 "Sender domain verified as aon.com — matched to known client programme AON-UK-CC-0047.",
 "Three distinct requests identified from email body: (1) decline investigation on card ****4421 at Marina Bay Sands, Singapore; (2) Q1 2026 spend breakdown for internal audit; (3) temporary limit increase from GBP 25,000 to GBP 35,000 for APAC roadshow.",
 "No attachments detected. No urgent flag. All three requests extracted with high confidence.",
 "Case created and assigned to SM David Mensah per programme CRM routing rules."
 ],
 artifacts: [{
 id: "art-01",
 type: "email_draft",
 label: "Inbound Email Rachel Griffiths",
 data: {
 from: "rachel.griffiths@aon.com",
 to: "hsbc.commercialcards.uk@hsbc.com",
 subject: "Three things — Sophia Chen card 4421",
 isIncoming: true,
 body: "Hi HSBC team,\n\nThree things on Sophia Chen's card (ending 4421) — she's our MD in Strategic Advisory and is about to head to APAC for a three-week client roadshow.\n\n1. Her card was declined yesterday evening at the Marina Bay Sands hotel in Singapore. Can you look into what happened and make sure it works for the trip? She'll be there from Monday and is panicking a bit about having no card access.\n\n2. I need a Q1 2026 spend breakdown for Sophia's card for our internal audit — ideally with merchant-level detail and cost centre codes. Our finance team needs this by end of week if possible.\n\n3. Her current limit is GBP 25,000. Given the APAC roadshow (client dinners, hotels across Singapore, Tokyo, Hong Kong), would it be possible to review and increase to GBP 35,000? I think it falls within what we're allowed to request but let me know if you need anything from me.\n\nAppreciate the help.\n\nBest,\nRachel\n\n--\nRachel Griffiths\nCommercial Cards Programme Administrator\nAon plc | 122 Leadenhall Street, London EC3V 4AN\nT: +44 20 7623 5500 ext. 4471 | rachel.griffiths@aon.com"
 }
 }]
 },
 {
 id: "step-2",
 title_p: "Verifying PA identity and loading programme configuration...",
 title_s: "PA Identity & Programme Verified",
 reasoning: [
 "Pace queried the HSBC CRM system for the sender (rachel.griffiths@aon.com).",
 "PA identity confirmed: Rachel Griffiths, Commercial Cards Programme Administrator, Aon plc (UK).",
 "Programme account retrieved: AON-UK-CC-0047. SM assigned: David Mensah. Preferred response format: formatted email with attachment.",
 "Cardholder record located: Sophia Chen, Managing Director — Strategic Advisory, card ****4421, active, no prior open cases.",
 "Programme policy loaded: POL-AON-UK-2026. All three requests validated against policy scope before investigation begins."
 ],
 artifacts: [{
 id: "art-02",
 type: "file",
 label: "CRM Programme Summary",
 pdfPath: "/data/CRM_Programme_Summary.pdf"
 }]
 },
 {
 id: "step-3",
 title_p: "Querying Authorisation Platform for decline details...",
 title_s: "Decline Code Retrieved & Interpreted",
 reasoning: [
 "Pace navigated to the HSBC Authorisation Platform and queried card ****4421 for the Marina Bay Sands transaction on 2026-03-08.",
 "Transaction located: GBP 1,840 at Marina Bay Sands Hotel & Resort, Singapore — Declined at 19:47 SGT.",
 "Decline code retrieved: Code 57 — Transaction not permitted to cardholder.",
 "Code 57 interpreted: Geographic restriction active on card — Singapore not in the approved travel region list. Card is otherwise active and in good standing.",
 "Fraud score checked in parallel: SAS score 22/100 — well below alert threshold. Decline is a restriction issue, not a fraud flag.",
 "Root cause confirmed: no fraud concern, no card block. Resolution path is travel region activation."
 ],
 artifacts: [{
 id: "art-03",
 type: "file",
 label: "Auth Platform Decline Record",
 pdfPath: "/data/Auth_Platform_Decline_Record.pdf"
 }]
 },
 {
 id: "step-4",
 title_p: "Assessing travel policy for Singapore, Japan, and Hong Kong...",
 title_s: "Travel Policy Assessed Across All Three Destinations",
 reasoning: [
 "Pace retrieved Rachel's email and confirmed the full APAC itinerary: Singapore, Japan, Hong Kong — 21-day roadshow.",
 "Programme policy POL-AON-UK-2026 loaded. Travel region rules (Section 4.2) applied to each destination:",
 "Singapore: OECD member since 2024 → qualifies for auto-approval under programme policy. Auto-approved.",
 "Japan: OECD member → qualifies for auto-approval. Auto-approved.",
 "Hong Kong: Non-OECD. Policy requires written PA confirmation for non-OECD destinations. Rachel's email constitutes written PA confirmation. Approved on PA authority.",
 "All three destinations cleared for activation. No SM intervention required for travel.",
 "Duration set to 21 days per Rachel's stated itinerary. Auto-revert date: 30 March 2026."
 ],
 artifacts: []
 },
 {
 id: "step-5",
 title_p: "Updating travel regions and card limit in MiVision...",
 title_s: "Travel Regions & Limit Updated in MiVision",
 reasoning: [
 "Pace navigated to MiVision and opened the cardholder profile for Sophia Chen, card ****4421, under programme AON-UK-CC-0047.",
 "Travel regions activated: Singapore (SGP), Japan (JPN), Hong Kong (HKG) — effective immediately, auto-reverts 30 March 2026. Reference: TRV-2026-0309-44211.",
 "Limit assessment: Requested GBP 35,000 is within the GBP 40,000 auto-approve ceiling for MD-level cardholders. Seven-point policy checklist completed — all criteria passed. No SM sign-off required.",
 "Limit updated: GBP 25,000 → GBP 35,000 temporary. Auto-reverts to GBP 25,000 on 30 March 2026. Reference: LIM-2026-0309-44212.",
 "Both changes confirmed in MiVision at 14:09:44 GMT."
 ],
 artifacts: [
 {
 id: "art-05a",
 type: "file",
 label: "MiVision Changes Confirmation",
 pdfPath: "/data/MiVision_Changes_Confirmation.pdf"
 },
 {
 id: "art-05b",
 type: "video",
 label: "MiVision Browser Recording",
 videoPath: "/data/MiVision_Browser_Recording.webm"
 }
 ]
 },
 {
 id: "step-6",
 title_p: "Filing Smart Data access request and sending authorisation email...",
 title_s: "Smart Data Access Requested for Q1 Spend Report",
 reasoning: [
 "Pace attempted to query Mastercard Smart Data OnLine™ for Sophia Chen's Q1 2026 transactions under programme AON-UK-CC-0047.",
 "Access restriction returned: programme AON-UK-CC-0047 has no active CDF3 distribution configured — a Mastercard Data Distribution Request (SD-DDR-2024) is required before report data can be accessed.",
 "Pace filed the SD-DDR-2024 form autonomously: read-only access, Q1 2026 scope, card ****4421. Reference: SD-DDR-2026-0309-AON047. Submitted at 14:09:52 GMT.",
 "Authorisation email drafted and sent to smartdata.admin@aon.com (cc: rachel.griffiths@aon.com), requesting approval from Aon's Global Smart Data Admin.",
 "Pace continued MiVision work (Step 5) in parallel during the wait. No delay to other requests."
 ],
 artifacts: [
 {
 id: "art-06a",
 type: "email_draft",
 label: "Smart Data Access Request Email",
 data: {
 from: "pace.servicehub@hsbc.com",
 to: "smartdata.admin@aon.com",
 cc: "rachel.griffiths@aon.com",
 subject: "[Action Required] Mastercard Smart Data OnLine — Data Distribution Authorisation — AON-UK-CC-0047",
 isSent: true,
 body: "Dear Aon Smart Data Administrator,\n\nHSBC Commercial Cards is requesting authorisation to access Mastercard Smart Data OnLine™ transaction data for the Aon plc Commercial Cards programme (AON-UK-CC-0047) in connection with a PA query received today.\n\nREQUEST DETAILS\n───────────────────────────────────────────────────\nReference: SD-DDR-2026-0309-AON047\nForm: Mastercard SD-DDR-2024\nAccess Type: Read-only — data retrieval\nProgramme: AON-UK-CC-0047 — Aon plc (UK)\nCardholder: Sophia Chen — card ending ••••4421\nPeriod: Q1 2026 (1 January 2026 — 31 March 2026)\nData Level: Level 3 (full transaction detail, GL codes, line items)\nPurpose: Internal audit spend report requested by PA Rachel Griffiths\n───────────────────────────────────────────────────\n\nNo CDF3 distribution is currently configured for programme AON-UK-CC-0047. This request, once approved, will enable HSBC to access the Q1 2026 data required to fulfil the above request. Access will be read-only and limited to the scope defined above.\n\nTo authorise this request, please reply to this email confirming your approval. Your response will be logged under case CSC-2026-0309-AON-0847.\n\nIf you have any questions, please contact the HSBC Commercial Cards team directly via hsbc.commercialcards.uk@hsbc.com or your assigned Service Manager, David Mensah (d.mensah@hsbc.com).\n\nYours sincerely,\n\nHSBC Commercial Cards — Pace Service Hub (automated)\nOn behalf of: David Mensah, Senior Card Consultant\nHSBC Bank plc | Commercial Banking | 8 Canada Square, London E14 5HQ\nhsbc.commercialcards.uk@hsbc.com"
 }
 },
 {
 id: "art-06b",
 type: "file",
 label: "SD DDR Form Submitted",
 pdfPath: "/data/SD_DDR_Form_Submitted.pdf"
 }
 ]
 },
 {
 id: "step-7",
 title_p: "Processing Smart Data approval and generating Q1 spend report...",
 title_s: "Smart Data Approval Received & Q1 Report Generated",
 reasoning: [
 "Approval email received from P. Nair (Aon Global Smart Data Admin) at 14:22:31 GMT — 6 minutes 13 seconds after request submission.",
 "Access granted: read-only, programme AON-UK-CC-0047, Q1 2026, card ****4421.",
 "Pace navigated to Smart Data OnLine™ and executed the Q1 spend query.",
 "Query returned: 84 transactions, GBP 21,480.60 total, 1 January–31 March 2026. Level 3 data available on 73% of transactions (merchant category, GL code, line-item detail). Remaining 27% at Level 2.",
 "Report formatted to Aon's preferred Excel template with merchant-level breakdown, cost centre codes, and transaction dates.",
 "Output file: Q1_2026_Sophia_Chen_SmartData — ready for attachment to client response."
 ],
 artifacts: [
 {
 id: "art-07a",
 type: "email_draft",
 label: "Smart Data Approval Email",
 data: {
 from: "p.nair@aon.com",
 to: "pace.servicehub@hsbc.com",
 cc: "rachel.griffiths@aon.com",
 subject: "RE: [Action Required] Mastercard Smart Data OnLine — Data Distribution Authorisation — AON-UK-CC-0047",
 isIncoming: true,
 body: "Hi,\n\nHappy to approve — please go ahead and access the Q1 2026 data for Sophia's card.\n\nReference: SD-DDR-2026-0309-AON047\n\nThanks,\nPriya\n\n--\nPriya Nair\nGlobal Smart Data Administrator | Aon plc\np.nair@aon.com | +44 20 7623 5500 ext. 5102"
 }
 },
 {
 id: "art-07b",
 type: "file",
 label: "Q1 Spend Report Sophia Chen",
 pdfPath: "/data/Q1_Spend_Report_Sophia_Chen.pdf"
 },
 {
 id: "art-07c",
 type: "video",
 label: "Smart Data Browser Recording",
 videoPath: "/data/Smart_Data_Browser_Recording.webm"
 }
 ]
 },
 {
 id: "step-8",
 title_p: "Logging case to CRM and confirming resolution...",
 title_s: "Case Logged & Closed",
 reasoning: [
 "Pace logged the completed case to the HSBC CRM system with a full action summary across all three requests.",
 "CRM case CSC-2026-0309-AON-0847 updated: travel activation (TRV-2026-0309-44211), limit change (LIM-2026-0309-44212), Smart Data report generated and attached.",
  "SM David Mensah flagged for review — all three requests resolved, response ready for approval and send."
 ],
 artifacts: [{
 id: "art-08",
 type: "file",
 label: "CRM Case Log",
 pdfPath: "/data/CRM_Case_Log.pdf"
 }]
 },
 {
 id: "step-9",
 title_p: "Drafting client response for SM review...",
 title_s: "Client Response Drafted & Queued for SM Approval",
 reasoning: [
 "Pace drafted a three-part client response to Rachel Griffiths covering all requests in a single email.",
 "Section 1 — Decline & Travel: Decline explained (geographic restriction, not fraud). Singapore, Japan, and Hong Kong now active for 21 days. Card ready for use immediately.",
 "Section 2 — Limit: Temporary increase to GBP 35,000 confirmed, effective now, reverts 30 March.",
 "Section 3 — Spend data: Q1 report (84 transactions, GBP 21,480.60) attached in Aon's preferred Excel format with merchant detail and cost centre codes.",
 "Q1_2026_Sophia_Chen_SmartData attached to email.",
 "Queued for David Mensah's review and approval before sending. SM action: review and send — no investigation required."
 ],
 artifacts: [
 {
 id: "art-09a",
 type: "email_draft",
 label: "Draft Client Response Rachel Griffiths",
 data: {
 from: "d.mensah@hsbc.com",
 to: "rachel.griffiths@aon.com",
 subject: "RE: Three things — Sophia Chen card 4421",
 isIncoming: false,
 isSent: false,
 body: "Hi Rachel,\n\nGood news — all three sorted. Here is a summary of what we've done.\n\n────────────────────────────────────────────────\n1. SINGAPORE DECLINE — RESOLVED\n────────────────────────────────────────────────\n\nThe decline at Marina Bay Sands was due to a geographic restriction on Sophia's card — Singapore was not in her approved travel regions list. This has nothing to do with the card being blocked or any security concern; it's a straightforward travel setting.\n\nWe've now activated the following regions for Sophia's card (••••4421):\n\n • Singapore (SGP) — active immediately\n • Japan (JPN) — active immediately\n • Hong Kong (HKG) — active immediately\n\nAll three are live as of today and will auto-revert on 30 March 2026 once the roadshow window closes. Sophia should have no further issues using the card across all three destinations.\n\n────────────────────────────────────────────────\n2. Q1 2026 SPEND REPORT — ATTACHED\n────────────────────────────────────────────────\n\nI've attached Sophia's Q1 2026 spend report in Excel format, formatted to Aon's standard template with merchant-level detail and cost centre codes.\n\n Period: 1 January — 31 March 2026\n Transactions: 84\n Total spend: GBP 21,480.60\n Level 3 data: Available on 73% of transactions (line-item detail, GL codes)\n Format: Excel — Aon standard reporting template\n\nPlease let me know if your finance team needs anything adjusted — happy to re-run the query with different filters or date ranges.\n\n────────────────────────────────────────────────\n3. LIMIT INCREASE — CONFIRMED\n────────────────────────────────────────────────\n\nSophia's card limit has been temporarily increased from GBP 25,000 to GBP 35,000, effective immediately. This will auto-revert to GBP 25,000 on 30 March 2026, aligned with the end of the APAC roadshow.\n\nRef: LIM-2026-0309-44212\n\nShe should have plenty of headroom for the trip. If the roadshow runs over or the limit needs further review, just drop us a note.\n\n────────────────────────────────────────────────\n\nIf there's anything else you need before Sophia heads off, don't hesitate to get in touch.\n\nKind regards,\n\nDavid Mensah\nSenior Card Consultant | HSBC Commercial Cards\nd.mensah@hsbc.com | +44 20 7991 8847\nHSBC Bank plc | 8 Canada Square, London E14 5HQ"
 }
 },
 {
 id: "art-09b",
 type: "file",
 label: "Q1 Spend Report Sophia Chen",
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

 // Processing state (spinner)
 updateProcessLog(PROCESS_ID, {
 id: step.id,
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 title: step.title_p,
 status: "processing"
 });
 await updateProcessListStatus(PROCESS_ID, "In Progress", step.title_p);
 await delay(2000 + Math.random() * 500);

 if (step.isHitl) {
 // HITL: show warning with artifacts, wait for SM to send email
 updateProcessLog(PROCESS_ID, {
 id: step.id,
 title: step.title_s,
 status: "warning",
 reasoning: step.reasoning || [],
 artifacts: step.artifacts || []
 });
 await updateProcessListStatus(PROCESS_ID, "Needs Review", "Draft Review: Email Pending");

 // Wait for SM David Mensah to review and click Send
 await waitForEmail();

 // After SM sends: mark as completed (final step)
 updateProcessLog(PROCESS_ID, {
 id: step.id,
 title: step.title_s,
 status: "completed",
 reasoning: step.reasoning || [],
 artifacts: step.artifacts || []
 });
 await updateProcessListStatus(PROCESS_ID, "Done", "All requests resolved — email sent to PA");
 await delay(1500);
 } else {
 // Normal step: success
 updateProcessLog(PROCESS_ID, {
 id: step.id,
 title: step.title_s,
 status: isFinal ? "completed" : "success",
 reasoning: step.reasoning || [],
 artifacts: step.artifacts || []
 });
 await updateProcessListStatus(PROCESS_ID, isFinal ? "Done" : "In Progress", step.title_s);
 await delay(1500);
 }
 }

 console.log(`${PROCESS_ID} Complete: ${CASE_NAME}`);
})();
