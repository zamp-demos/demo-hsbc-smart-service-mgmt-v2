const fs = require('fs');
const path = require('path');

// DR Case 2: Linklaters — Duplicate Adobe charge on card 3874
// Case ID: CB-2026-0315-LNK-0082
// 9 steps, NO HITL, final status: Done

const CASE_ID = 'CB-2026-0315-LNK-0082';
const PROCESS_FILE = path.join(__dirname, '..', 'public', 'data', `process_${CASE_ID}.json`);
const PROCESSES_FILE = path.join(__dirname, '..', 'public', 'data', 'processes.json');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function updateProcessLog(logEntry, keyDetailsUpdate = {}) {
  let data = { logs: [], keyDetails: {}, sidebarArtifacts: [] };
  if (fs.existsSync(PROCESS_FILE)) {
    try { data = JSON.parse(fs.readFileSync(PROCESS_FILE, 'utf8')); } catch(e) {}
    if (!data.logs) data.logs = [];
    if (!data.keyDetails) data.keyDetails = {};
    if (!data.sidebarArtifacts) data.sidebarArtifacts = [];
  }
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
  fs.writeFileSync(PROCESS_FILE, JSON.stringify(data, null, 2));
}

function updateProcessListStatus(status, currentStatus) {
  const list = JSON.parse(fs.readFileSync(PROCESSES_FILE, 'utf8'));
  const entry = list.find(p => p.id === CASE_ID);
  if (entry) {
    entry.status = status;
    entry.currentStatus = currentStatus;
    fs.writeFileSync(PROCESSES_FILE, JSON.stringify(list, null, 2));
  }
}

const EMAIL_STEP1_BODY = `Dear HSBC Commercial Cards Team,

I am writing to formally raise a dispute on behalf of Amara Diallo (Head of IT & Infrastructure, Linklaters LLP), card ending 3874, regarding a duplicate charge from Adobe Systems Europe Ltd.

BACKGROUND

During our monthly programme reconciliation on 14 March 2026, I identified that card ••••3874 has been charged GBP 4,180.00 by Adobe Systems on two occasions within two days:

  - Charge 1: GBP 4,180.00 — 1 March 2026 (transaction settled 2 March)
  - Charge 2: GBP 4,180.00 — 3 March 2026 (transaction settled 4 March)

Both charges are for the annual Creative Cloud for Enterprise licence renewal for Linklaters (85 seats). Only one annual renewal was due and only one invoice was raised (Invoice ADOBE-INV-2026-LNK-00847).

STEPS TAKEN

I contacted Adobe Systems' billing team on 5 March 2026. On 7 March 2026, Adobe confirmed in writing that both charges arose from a batch processing error — the same transaction was submitted twice in Adobe's March billing run. Adobe advised that a refund was being raised internally. As of today, 15 March 2026 — 12 days after the duplicate charge — no credit has appeared on card ••••3874.

I am attaching the following:
  1. Adobe invoice ADOBE-INV-2026-LNK-00847 (single invoice — GBP 4,180.00 — one renewal)
  2. Adobe's written acknowledgement of the duplicate processing error (email dated 7 March 2026)
  3. Card statement excerpt showing both charges

Please advise on the chargeback process and let us know if any further information is needed.

Kind regards,

Tom Hartley
Programme Administrator — Commercial Cards
Linklaters LLP
One Silk Street, London EC2Y 8HQ
t.hartley@linklaters.com | Direct: +44 20 7456 2000

[Attachments: Adobe_Invoice_ADOBE-INV-2026-LNK-00847.pdf, Adobe_Duplicate_Error_Acknowledgement_07Mar2026.pdf, Linklaters_Card_Statement_Excerpt_Mar2026.pdf]`;

const EMAIL_STEP7_BODY = `Dear Tom,

Thank you for raising this dispute. I am writing to confirm that we have formally filed a chargeback with Mastercard in respect of the duplicate Adobe Systems charge on Amara Diallo's card (••••3874).

CASE DETAILS

  HSBC Case Reference:       CB-2026-0315-LNK-0082
  Mastercard Case Reference: MC-2026-031-0194423
  Disputed Merchant:         Adobe Systems Europe Ltd
  Disputed Amount:           GBP 4,180.00
  Mastercard Reason Code:    4834 — Duplicate Processing
  Date Filed:                15 March 2026

The charge of GBP 4,180.00 on 1 March 2026 (the original annual renewal) will remain on the account and is not in dispute.

PROVISIONAL CREDIT

A provisional credit of GBP 4,180.00 has been applied to the Linklaters LLP programme account (LNK-PROG-UK-0019) today, 15 March 2026.

Please note that this credit is conditional pending the outcome of the Mastercard investigation. Given that Adobe Systems has already acknowledged the duplicate processing error in writing, we expect the chargeback to be accepted without challenge. We will confirm this to you as soon as the outcome is received.

NEXT STEPS

Adobe Systems' bank has until 29 April 2026 to respond. We will monitor the case and update you as soon as a decision is received.

You do not need to take any further action at this stage.

Kind regards,

Sarah Okonkwo
Senior Card Consultant — Commercial Cards
HSBC Bank plc
sarah.okonkwo@hsbc.com | Direct: +44 20 7991 8400`;

const EMAIL_STEP9_BODY = `Dear Tom,

I am pleased to confirm that the chargeback filed on behalf of Amara Diallo has been fully resolved in Linklaters' favour.

RESOLUTION SUMMARY

  HSBC Case Reference:       CB-2026-0315-LNK-0082
  Mastercard Case Reference: MC-2026-031-0194423
  Disputed Merchant:         Adobe Systems Europe Ltd
  Amount Recovered:          GBP 4,180.00
  Mastercard Reason Code:    4834 — Duplicate Processing
  Resolution Date:           26 March 2026
  Outcome:                   Chargeback upheld — merchant accepted in full

PROVISIONAL CREDIT — NOW PERMANENT

The provisional credit of GBP 4,180.00 applied to the Linklaters LLP programme account on 15 March 2026 is now confirmed as permanent. No reversal will occur. The full amount of GBP 4,180.00 has been recovered on Amara Diallo's behalf.

Adobe Systems Europe Ltd's bank accepted the chargeback on 26 March 2026 without filing a challenge.

Please note that the original annual renewal charge of GBP 4,180.00 (1 March 2026) remains on the account as the legitimate transaction and is not affected by this resolution.

CASE CLOSED

This case is now closed. No further action is required from Linklaters LLP or Amara Diallo.

If you have any questions, please do not hesitate to contact me.

Kind regards,

Sarah Okonkwo
Senior Card Consultant — Commercial Cards
HSBC Bank plc
sarah.okonkwo@hsbc.com | Direct: +44 20 7991 8400`;

const STEPS = [
  {
    id: 1,
    title_p: "Dispute Email Received",
    title_s: "& Claim Extracted",
    reasoning: [
      "Inbound email received from t.hartley@linklaters.com to the HSBC Commercial Cards service mailbox at 10:41:08 GMT on 2026-03-15.",
      "Sender domain verified as linklaters.com \u2014 matched to known client programme LNK-PROG-UK-0019.",
      "Email subject: \"Duplicate charge dispute \u2014 Adobe Systems \u2014 Amara Diallo \u2022\u2022\u2022\u20223874.\"",
      "Dispute claim extracted from email body: Adobe Systems charged card \u2022\u2022\u2022\u20223874 GBP 4,180.00 on 2026-03-01 for the annual Creative Cloud enterprise licence renewal. An identical charge of GBP 4,180.00 appeared again on 2026-03-03. Tom identified the duplication during the monthly programme reconciliation. Only one renewal was due \u2014 Adobe\u2019s billing team confirmed the second charge was a processing error. No refund has appeared in 12 days.",
      "Three attachments detected and queued for document review: Adobe invoice, Adobe\u2019s error acknowledgement email, and a card statement excerpt.",
      "Case CB-2026-0315-LNK-0082 created and assigned to SM Sarah Okonkwo per programme routing rules."
    ],
    artifacts: [
      { label: "Inbound Email from Tom Hartley", type: "email_draft", data: { to: "commercialcards.service@hsbc.com", from: "t.hartley@linklaters.com", cc: "a.diallo@linklaters.com", subject: "Duplicate charge dispute \u2014 Adobe Systems \u2014 Amara Diallo \u2022\u2022\u2022\u20223874", body: EMAIL_STEP1_BODY, isIncoming: true, isSent: false } }
    ]
  },
  {
    id: 2,
    title_p: "PA, Cardholder",
    title_s: "& Programme Verified",
    reasoning: [
      "Pace queried the HSBC CRM system for the sender (t.hartley@linklaters.com).",
      "PA identity confirmed: Tom Hartley, Commercial Cards Programme Administrator, Linklaters LLP (UK).",
      "Programme account retrieved: LNK-PROG-UK-0019. SM assigned: Sarah Okonkwo. SLA tier: Standard. Preferred response format: formal email.",
      "Cardholder record located: Amara Diallo, Head of IT & Infrastructure, Corporate Card \u2022\u2022\u2022\u20223874 \u2014 active, no outstanding alerts, no suspended flags.",
      "Programme dispute policy loaded: POL-LNK-UK-2026. Dispute handling authority confirmed \u2014 PA is authorised to raise disputes on behalf of cardholders."
    ],
    artifacts: [
      { label: "CRM Programme Summary", type: "file", pdfPath: "/data/DR2_CRM_Programme_Summary.pdf" }
    ]
  },
  {
    id: 3,
    title_p: "Both Transactions Located",
    title_s: "& Duplicate Confirmed",
    reasoning: [
      "Pace queried the HSBC Authorisation Platform for card \u2022\u2022\u2022\u20223874 filtering for Adobe Systems transactions in March 2026.",
      "Two transactions located \u2014 identical in every material field: Charge 1: GBP 4,180.00 on 2026-03-01 (settled 2026-03-02), Charge 2: GBP 4,180.00 on 2026-03-03 (settled 2026-03-04). Same merchant, same MCC 5734, same MID, same acquirer BIN.",
      "Both charges authorised and fully settled. Duplication confirmed at the transaction level.",
      "Card confirmed in good standing: no block, no restriction, no flag.",
      "MiVision profile checked: card \u2022\u2022\u2022\u20223874 active. No credit from Adobe Systems has appeared on the account.",
      "SAS Fraud Management checked: no alerts, no flags. Software subscription charges consistent with Amara Diallo\u2019s 12-month spend pattern.",
      "Chargeback history checked: one prior chargeback on this programme 14 months ago \u2014 resolved in HSBC\u2019s favour. No adverse dispute history.",
      "This is a processing error by the merchant \u2014 not fraud, not a cardholder dispute. Investigation proceeds on that basis."
    ],
    artifacts: [
      { label: "Auth Platform Duplicate Transaction Record", type: "file", pdfPath: "/data/DR2_Auth_Platform_Duplicate_Transaction_Record.pdf" },
      { label: "SAS Clean Check Report", type: "file", pdfPath: "/data/DR2_SAS_Clean_Check_Report.pdf" }
    ]
  },
  {
    id: 4,
    title_p: "Dispute Type & Mastercard",
    title_s: "Filing Rights Assessed",
    reasoning: [
      "Pace assessed the dispute against Mastercard\u2019s reason code framework to identify the correct filing category and confirm HSBC\u2019s right to file.",
      "Reason code 4837 (Fraud \u2014 Unauthorised Transaction): Ruled out. Both transactions were authorised by the cardholder\u2019s account. No fraud indicators. SAS clean.",
      "Reason code 4853 (Cardholder Dispute \u2014 Services Not Rendered): Ruled out. The service was rendered \u2014 one legitimate licence renewal was delivered as contracted.",
      "Reason code 4831 (Transaction Amount Differs): Ruled out. Both charges are at the correct licence fee amount \u2014 the problem is that one of them should not have been submitted at all.",
      "Reason code 4834 (Duplicate Processing): Confirmed. Adobe submitted the same transaction in two consecutive batch submissions. Both were processed and settled on card \u2022\u2022\u2022\u20223874. Only one renewal was contractually due.",
      "Mastercard filing window assessed: duplicate charge date 2026-03-03. 108 days remaining of the 120-day window. No deadline risk.",
      "Good-faith write-off threshold assessed: GBP 4,180.00 materially exceeds the internal threshold. Adobe\u2019s own written acknowledgement removes any credible merchant defence.",
      "Decision: file a Mastercard First Chargeback under reason code 4834. Proceed to evidence assembly."
    ],
    artifacts: [
      { label: "Reason Code Assessment Report", type: "file", pdfPath: "/data/DR2_Reason_Code_Assessment_Report.pdf" }
    ]
  },
  {
    id: 5,
    title_p: "Attachments Reviewed",
    title_s: "& Evidence Inventory Confirmed",
    reasoning: [
      "Pace reviewed all three attachments from Tom\u2019s email without any manual handling.",
      "Attachment 1 \u2014 Adobe Invoice (PDF): Invoice ADOBE-INV-2026-LNK-00847, billed to Linklaters LLP, card \u2022\u2022\u2022\u20223874. Creative Cloud for Enterprise \u2014 Annual Licence Renewal, 85 seats. GBP 4,180.00. One invoice \u2014 one renewal. No second invoice exists.",
      "Attachment 2 \u2014 Adobe Error Acknowledgement Email: From adobe-billing@adobe.com dated 2026-03-07. Adobe confirmed the duplicate in writing.",
      "Attachment 3 \u2014 Card Statement Excerpt: Both Adobe charges shown on 2026-03-02 and 2026-03-04. Amounts, dates, and merchant names match HSBC records exactly.",
      "Evidence inventory assessed against Mastercard 4834 requirements: All 5 required items confirmed \u2014 both transaction records, proof only one was due, merchant acknowledgement, no refund confirmation, PA written statement.",
      "All five required evidence items confirmed from the documents already provided. No further requests to the PA are needed."
    ],
    artifacts: [
      { label: "Evidence Review Report", type: "file", pdfPath: "/data/DR2_Evidence_Review_Report.pdf" }
    ]
  },
  {
    id: 6,
    title_p: "Evidence Package Assembled",
    title_s: "& Filing Prepared",
    reasoning: [
      "Pace assembled the full evidence package for MDR submission without any further input from the PA.",
      "All documents confirmed compliant with MDR upload specifications \u2014 file formats verified, sizes within MDR limits, no reformatting required.",
      "Evidence bundle prepared: five documents \u2014 Adobe invoice, Adobe error acknowledgement email, card statement excerpt with both charges highlighted, HSBC authorisation platform records for both transactions, MiVision account screen confirming no credit received.",
      "Dispute description drafted for the MDR free-text field: references Mastercard Rule 4834, cites both transaction dates and settlement dates, notes Adobe issued only one invoice, flags Adobe\u2019s billing team confirmed the duplicate in writing on 2026-03-07.",
      "All five evidence items verified complete. Package ready for submission. No PA follow-up required."
    ],
    artifacts: [
      { label: "Evidence Package Summary", type: "file", pdfPath: "/data/DR2_Evidence_Package_Summary.pdf" }
    ]
  },
  {
    id: 7,
    title_p: "Mastercard Chargeback Filed",
    title_s: "via MDR Portal + Provisional Credit Applied",
    reasoning: [
      "Pace navigated to the Mastercard Dispute Resolution (MDR) portal using HSBC\u2019s issuer credentials.",
      "New dispute case created for the duplicate charge on card \u2022\u2022\u2022\u20223874: GBP 4,180.00, Adobe Systems Europe Ltd, transaction date 2026-03-03 (the duplicate charge being disputed).",
      "Reason code 4834 \u2014 Duplicate Processing selected. Both transaction references entered \u2014 the legitimate charge (2026-03-01) and the duplicate (2026-03-03) \u2014 so Mastercard can see both sides of the duplication.",
      "Dispute description entered citing Adobe\u2019s own written confirmation of the batch processing error.",
      "Evidence bundle uploaded to MDR: five documents \u2014 all within format and size specifications.",
      "First Chargeback filed and confirmed at 11:09 GMT. Mastercard case reference: MC-2026-031-0194423.",
      "Merchant\u2019s acquirer notified by Mastercard. Merchant response deadline: 2026-04-29 (45 days from filing date).",
      "Provisional credit of GBP 4,180.00 applied to programme account LNK-PROG-UK-0019 \u2014 3 seconds after filing confirmation.",
      "PA notification email drafted and sent to Tom Hartley: chargeback filed under reason code 4834, provisional credit of GBP 4,180.00 applied, merchant has until 29 April to respond, no further action required from Linklaters at this stage."
    ],
    artifacts: [
      { label: "MDR Filing Confirmation", type: "file", pdfPath: "/data/DR2_MDR_Filing_Confirmation.pdf" },
      { label: "MDR Chargeback Filing Recording", type: "video", videoPath: "/data/DR2_MDR_Chargeback_Filing_Recording.webm" },
      { label: "Provisional Credit Notification", type: "email_draft", data: { to: "t.hartley@linklaters.com", from: "sarah.okonkwo@hsbc.com", cc: "a.diallo@linklaters.com", subject: "Chargeback filed \u2014 Provisional credit applied \u2014 Amara Diallo \u2022\u2022\u2022\u20223874 \u2014 Adobe Systems duplicate charge", body: EMAIL_STEP7_BODY, isIncoming: false, isSent: true } }
    ]
  },
  {
    id: 8,
    title_p: "Merchant Acceptance",
    title_s: "Detected",
    reasoning: [
      "Pace monitored MDR case MC-2026-031-0194423 daily for any status change.",
      "Status change detected at 09:17 GMT on 2026-03-26 \u2014 11 days after the First Chargeback was filed.",
      "MDR case status updated to: Merchant Accepted \u2014 No Representment Filed.",
      "Adobe Systems Europe Ltd\u2019s acquirer accepted the chargeback in full within the 45-day merchant window. No challenge, no counter-evidence, no appeal.",
      "GBP 4,180.00 confirmed transferred from the merchant\u2019s reserve to HSBC\u2019s settlement account.",
      "Adobe had already acknowledged the processing error in writing before the chargeback was even filed. No credible basis existed for the merchant to contest."
    ],
    artifacts: [
      { label: "MDR Merchant Acceptance Record", type: "file", pdfPath: "/data/DR2_MDR_Merchant_Acceptance_Record.pdf" },
      { label: "MDR Merchant Acceptance Recording", type: "video", videoPath: "/data/DR2_MDR_Merchant_Acceptance_Recording.webm" }
    ]
  },
  {
    id: 9,
    title_p: "Case Closed, Credit Made Permanent",
    title_s: "& Pattern Recorded",
    reasoning: [
      "Provisional credit of GBP 4,180.00 confirmed permanent on programme account LNK-PROG-UK-0019. No reversal will occur.",
      "PA closure email drafted and sent to Tom Hartley: chargeback upheld in full, provisional credit confirmed permanent, full amount of GBP 4,180.00 recovered on Amara Diallo\u2019s behalf.",
      "CRM case CB-2026-0315-LNK-0082 closed with full action log: all nine steps recorded, both transaction records documented, Adobe\u2019s acknowledgement referenced, MDR outcome confirmed.",
      "Pattern noted across historical cases: Three 4834 disputes in the past 90 days where the merchant had already acknowledged the duplicate error in writing before the chargeback was filed. Merchant acceptance rate for this pattern: 3 out of 3.",
      "Knowledge base updated: When a 4834 dispute arrives with a pre-existing written merchant acknowledgement of the duplication, Pace will classify the case as high-confidence, bypass the evidence request step entirely, and proceed directly to MDR filing."
    ],
    artifacts: [
      { label: "Case Closure Confirmation", type: "email_draft", data: { to: "t.hartley@linklaters.com", from: "sarah.okonkwo@hsbc.com", cc: "a.diallo@linklaters.com", subject: "Chargeback resolved \u2014 Full amount recovered \u2014 Amara Diallo \u2022\u2022\u2022\u20223874 \u2014 Adobe Systems", body: EMAIL_STEP9_BODY, isIncoming: false, isSent: true } },
      { label: "CRM Case Log", type: "file", pdfPath: "/data/DR2_CRM_Case_Log.pdf" }
    ]
  }
];

// Ensure process entry exists in processes.json
function ensureProcessEntry() {
  const list = JSON.parse(fs.readFileSync(PROCESSES_FILE, 'utf8'));
  const existing = list.findIndex(p => p.id === CASE_ID);
  const caseEntry = {
    id: CASE_ID,
    name: "Linklaters \u2014 Duplicate Adobe charge on \u00b7\u00b7\u00b7\u00b73874",
    category: "Dispute Resolution",
    client: "Linklaters LLP",
    cardholder: "Amara Diallo",
    sm: "Sarah Okonkwo",
    status: "In Progress",
    pathway: "Dispute Resolution",
    process: CASE_ID,
    stockId: CASE_ID
  };
  if (existing !== -1) list[existing] = caseEntry;
  else list.push(caseEntry);
  fs.writeFileSync(PROCESSES_FILE, JSON.stringify(list, null, 2));
}

// Main execution
async function run() {
  console.log('[DR_002] Starting DR Case 2: CB-2026-0315-LNK-0082');
  ensureProcessEntry();

  // Initialize empty process file with correct structure
  fs.writeFileSync(PROCESS_FILE, JSON.stringify({ logs: [], keyDetails: {}, sidebarArtifacts: [] }, null, 2));
  updateProcessListStatus('In Progress', 'Processing dispute');

  for (const step of STEPS) {
    // Write in-progress
    updateProcessLog({
      id: step.id,
      title: step.title_p,
      status: 'in-progress',
      reasoning: [],
      artifacts: []
    });
    updateProcessListStatus('In Progress', step.title_p);
    await sleep(1800);

    // Write completed
    updateProcessLog({
      id: step.id,
      title: step.title_s,
      status: 'done',
      reasoning: step.reasoning,
      artifacts: step.artifacts
    });
    console.log(`[DR_002] Step ${step.id} completed: ${step.title_p} ${step.title_s}`);
  }

  updateProcessListStatus('Done', "Resolved in HSBC's Favour");
  console.log('[DR_002] Case complete: Done');
}

module.exports = { run, CASE_ID };
