const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public/data');
const PROCESSES_FILE = path.join(PUBLIC_DATA_DIR, 'processes.json');
const PROCESS_ID = "CSC-2026-0309-HSF-0314";
const CASE_NAME = "Cardholder Name Change — Three-Document Identity Chain";

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

 // Initialize process log with key details
 writeJson(path.join(PUBLIC_DATA_DIR, `process_${PROCESS_ID}.json`), {
  logs: [],
  keyDetails: {
   "Client": "Herbert Smith Freehills LLP (UK)",
   "Cardholder": "Eleanor Whitfield-Osei \u2022\u2022\u2022\u20222847",
   "Programme": "HSF-PROG-UK-0089",
   "SM Assigned": "David Mensah",
     }
 });

 const steps = [
  {
   id: "step-1",
   title_p: "Receiving and parsing inbound email from PA...",
   title_s: "Email Received & Attachment Detected",
   reasoning: [
    "Inbound email received from priya.nair@hsf.com to the HSBC Commercial Cards service mailbox at 14:31:08 GMT.",
    "Sender domain verified as hsf.com -- matched to known client programme HSF-PROG-UK-0089.",
    "Request identified: cardholder name change following marriage for Eleanor Whitfield-Osei, card ****2847. New name requested: Eleanor Sutherland.",
    "One PDF attachment detected: Eleanor_Sutherland_Marriage_Certificate.pdf (847 KB).",
    "Pace did not immediately query MiVision. The document must be ingested and extracted first -- the extracted legal name will be the reference for all subsequent verification.",
    "Case created and assigned to SM David Mensah per programme CRM routing rules."
   ],
   artifacts: [{
    id: "art-01",
    type: "email_draft",
    label: "Inbound Email Priya Nair",
    data: {
     from: "Priya Nair <priya.nair@hsf.com>",
     to: "HSBC Commercial Cards <hsbc.commercialcards.uk@hsbc.com>",
     subject: "Name change -- Eleanor Whitfield-Osei, card 2847",
     body: "Hi,\n\nOne of our senior associates, Eleanor Whitfield-Osei (card ending 2847), recently got married and has changed her name. Could you please update her card and account records accordingly?\n\nHer new legal name is Eleanor Sutherland. I've attached her marriage certificate.\n\nPlease let me know if you need anything else.\n\nThanks,\nPriya Nair\nCommercial Cards Programme Administrator\nHerbert Smith Freehills LLP | Exchange House, Primrose Street, London EC2A 2EG\nT: +44 20 7466 2000 | priya.nair@hsf.com",
     isIncoming: true
    }
   }]
  },
  {
   id: "step-2",
   title_p: "Querying CRM for PA identity and programme details...",
   title_s: "PA Identity & Programme Verified",
   reasoning: [
    "Pace queried the HSBC CRM system for the sender (priya.nair@hsf.com).",
    "PA identity confirmed: Priya Nair, Commercial Cards Programme Administrator, Herbert Smith Freehills LLP.",
    "Programme account retrieved: HSF-PROG-UK-0089. SM assigned: David Mensah. Preferred response format: plain email.",
    "Cardholder record located: Eleanor Whitfield-Osei, Senior Associate -- Corporate Finance, card ****2847, active, no prior name change recorded.",
    "Name change request type confirmed -- document ingestion required before any system lookup or action."
   ],
   artifacts: [{
    id: "art-02",
    type: "file",
    label: "CRM Programme Summary",
    pdfPath: "/data/Case3_CRM_Programme_Summary.pdf"
   }]
  },
  {
   id: "step-3",
   title_p: "Ingesting marriage certificate and extracting structured data...",
   title_s: "Marriage Certificate Ingested & Data Extracted",
   reasoning: [
    "Pace ingested Eleanor_Sutherland_Marriage_Certificate.pdf and identified the document type as a UK Marriage Certificate in standard General Register Office (GRO) format.",
    "Structured extraction completed across all fields. Key fields extracted:",
    "Registration district: London Borough of Kensington and Chelsea. Date of marriage: 14 February 2026.",
    "Bride name before marriage: Eleanor Jane Whitfield. Bride name after marriage: Eleanor Jane Sutherland.",
    "Certificate reference: KCC-2026-02-14-00471. Issuing authority: General Register Office, HMSO.",
    "Extraction confidence: High. Document format matched standard GRO layout. All required fields present. No visible alteration detected."
   ],
   artifacts: [
    {
     id: "art-03",
     type: "file",
     label: "Marriage Certificate Received",
     pdfPath: "/data/Case3_Marriage_Certificate_Received.pdf"
    },
    {
     id: "art-04",
     type: "file",
     label: "Marriage Certificate Extraction Report",
     pdfPath: "/data/Case3_Marriage_Certificate_Extraction_Report.pdf"
    }
   ]
  },
  {
   id: "step-4",
   title_p: "Cross-referencing extracted name against MiVision cardholder record...",
   title_s: "Name Cross-Referenced Against MiVision — Discrepancy Detected",
   reasoning: [
    "Pace queried MiVision for the current cardholder record on card ****2847 under programme HSF-PROG-UK-0089.",
    "MiVision returned: full name on card -- Eleanor Whitfield-Osei.",
    "Cross-reference performed: certificate states bride's name before marriage as Eleanor Jane Whitfield. Card record holds Eleanor Whitfield-Osei -- a hyphenated surname not reflected in the certificate's pre-marriage name field.",
    "Discrepancy confirmed. The identity chain from the current card name (Whitfield-Osei) to the new married name (Sutherland) cannot be established from the marriage certificate alone. An intermediate name change -- from Whitfield to Whitfield-Osei -- is not documented.",
    "Pace did not attempt to proceed. The missing link must be closed by an additional document before any update is made to the cardholder record."
   ],
   artifacts: [
    {
     id: "art-05",
     type: "file",
     label: "MiVision Cardholder Profile",
     pdfPath: "/data/Case3_MiVision_Cardholder_Profile.pdf"
    },
    {
     id: "art-06",
     type: "file",
     label: "Name Discrepancy Report",
     pdfPath: "/data/Case3_Name_Discrepancy_Report.pdf"
    }
   ]
  },
  {
   id: "step-5",
   title_p: "Drafting document request for PA -- SM review required...",
   title_s: "Document Request Drafted & Sent to PA",
   isHitl: true,
   reasoning: [
    "Pace drafted a precise document request to Priya Nair explaining exactly what gap exists and exactly what document will close it.",
    "Request cited: certificate shows pre-marriage name as Eleanor Jane Whitfield; card holds Eleanor Whitfield-Osei; the step between Whitfield and Whitfield-Osei is not documented.",
    "Two acceptable documents specified: current passport (showing the name Eleanor Whitfield-Osei), or a deed poll or statutory declaration from the prior name change.",
    "SM David Mensah reviewed and approved the document request at 14:39:22 GMT.",
    "Request sent to Priya Nair at 14:39:22 GMT. Pace paused -- no action taken on MiVision pending receipt of the additional document."
   ],
   artifacts: [{
    id: "art-07",
    type: "email_draft",
    label: "Document Request Email",
    data: {
     from: "David Mensah -- HSBC Commercial Cards <d.mensah@hsbc.com>",
     to: "Priya Nair <priya.nair@hsf.com>",
     subject: "RE: Name change -- Eleanor Whitfield-Osei, card 2847 -- additional document required",
     body: "Hi Priya,\n\nThank you for the name change request for Eleanor (card ending 2847) -- we've received the marriage certificate and have begun processing.\n\nBefore we can complete the update, we need one additional document from you. Here is why:\n\nThe marriage certificate shows Eleanor's name before marriage as Eleanor Jane Whitfield. However, her current card record holds the name Eleanor Whitfield-Osei. To update the card to her new married name (Eleanor Sutherland), we need to verify the full legal name chain -- that is, how Eleanor's name moved from Whitfield to Whitfield-Osei before arriving at Sutherland.\n\nCould you please provide one of the following:\n\n  - Eleanor's current passport (showing the name Eleanor Whitfield-Osei), or\n  - A deed poll or statutory declaration from the prior name change (Whitfield -> Whitfield-Osei)\n\nEither document will allow us to complete the identity chain and process the update straight away.\n\nApologies for the extra step -- this is a standard identity verification requirement for name changes on commercial card accounts.\n\nKind regards,\nDavid Mensah\nSenior Card Consultant | HSBC Commercial Cards\nd.mensah@hsbc.com | +44 20 7991 8847\nHSBC Bank plc | 8 Canada Square, London E14 5HQ",
     isIncoming: false,
     isSent: false
    }
   }]
  },
  {
   id: "step-6",
   title_p: "Inbound response received from PA -- processing attachment...",
   title_s: "PA Response Received -- Passport Attached",
   reasoning: [
    "Response received from priya.nair@hsf.com at 14:58:26 GMT -- 19 minutes 04 seconds after the document request.",
    "Priya confirmed context: the hyphenated name (Whitfield-Osei) is from a prior marriage. Passport was renewed in 2025 and reflects the Whitfield-Osei name.",
    "One PDF attachment detected: Eleanor_Whitfield-Osei_Passport.pdf (1.2 MB).",
    "Pace resumed session at 14:58:26 GMT. Document ingestion initiated immediately."
   ],
   artifacts: [{
    id: "art-08",
    type: "email_draft",
    label: "PA Response with Passport",
    data: {
     from: "Priya Nair <priya.nair@hsf.com>",
     to: "David Mensah -- HSBC Commercial Cards <d.mensah@hsbc.com>",
     subject: "RE: Name change -- Eleanor Whitfield-Osei, card 2847 -- additional document required",
     body: "Hi David,\n\nOf course -- the hyphenated name is from a prior marriage. Eleanor renewed her passport last year and it still reflects the Whitfield-Osei name. I've attached a copy.\n\nLet me know if you need anything else.\n\nThanks,\nPriya",
     isIncoming: true
    }
   }]
  },
  {
   id: "step-7",
   title_p: "Ingesting passport and extracting structured data...",
   title_s: "Passport Ingested & Data Extracted",
   reasoning: [
    "Pace ingested Eleanor_Whitfield-Osei_Passport.pdf and identified the document type as a United Kingdom Passport issued by HM Passport Office.",
    "Structured extraction completed across all fields. Key fields extracted:",
    "Surname: Whitfield-Osei. Given names: Eleanor Jane.",
    "Date of birth: confirmed match against MiVision record. Passport number: 523847610.",
    "Date of issue: 2025-03-18. Date of expiry: 2035-03-17. Issuing authority: HM Passport Office.",
    "Machine Readable Zone (MRZ) checksums validated -- document integrity confirmed.",
    "Extraction confidence: High. Date of birth matched MiVision exactly -- same individual confirmed."
   ],
   artifacts: [
    {
     id: "art-09",
     type: "file",
     label: "Passport Received",
     pdfPath: "/data/Case3_Passport_Received.pdf"
    },
    {
     id: "art-10",
     type: "file",
     label: "Passport Extraction Report",
     pdfPath: "/data/Case3_Passport_Extraction_Report.pdf"
    }
   ]
  },
  {
   id: "step-8",
   title_p: "Constructing and validating three-name identity chain...",
   title_s: "Three-Name Identity Chain Constructed & Validated",
   reasoning: [
    "Pace assembled the full legal identity trail across both documents and the MiVision record.",
    "Name 1 -- Eleanor Jane Whitfield: Source -- Marriage Certificate KCC-2026-02-14-00471 (bride name before marriage field).",
    "Name 2 -- Eleanor Jane Whitfield-Osei: Source -- UK Passport 523847610 (issued 2025, MRZ validated). Corroborated by MiVision cardholder record.",
    "Name 3 -- Eleanor Jane Sutherland: Source -- Marriage Certificate KCC-2026-02-14-00471 (bride name after marriage field).",
    "Chain validation: Link 1 (Whitfield to Whitfield-Osei) confirmed by passport. Link 2 (Whitfield-Osei to Sutherland) confirmed by marriage certificate. Date of birth match across passport and MiVision confirms same individual throughout.",
    "Identity chain: complete and verified. No gaps.",
    "Additional check: CRM queried for open fraud alerts or account restrictions on card ****2847 -- returned clear. Pace cleared to execute the name change."
   ],
   artifacts: [{
    id: "art-11",
    type: "file",
    label: "Identity Chain Validation Report",
    pdfPath: "/data/Case3_Identity_Chain_Validation_Report.pdf"
   }]
  },
  {
   id: "step-9",
   title_p: "Executing name change in MiVision and initiating replacement card...",
   title_s: "Name Change Executed in MiVision & Replacement Card Initiated",
   reasoning: [
    "Pace navigated to MiVision and opened the cardholder record for card ****2847 under programme HSF-PROG-UK-0089.",
    "Name updated: Eleanor Jane Whitfield-Osei to Eleanor Jane Sutherland. Embossed name on card updated: E WHITFIELD-OSEI to E SUTHERLAND.",
    "Identity document logged to MiVision record: UK Passport 523847610 (HM Passport Office, exp 2035-03-17).",
    "Name change history entry created with document references: marriage certificate KCC-2026-02-14-00471 and passport 523847610.",
    "Replacement card request raised: existing card ****2847 now bears the wrong embossed name. Physical replacement initiated -- reference CRD-2026-0309-28471. Delivery address flagged as outstanding -- to be confirmed by PA.",
    "MiVision update confirmed at 15:02:14 GMT."
   ],
   artifacts: [
    {
     id: "art-12",
     type: "file",
     label: "MiVision Name Change Confirmation",
     pdfPath: "/data/Case3_MiVision_Name_Change_Confirmation.pdf"
    },
    {
     id: "art-13",
     type: "video",
     label: "MiVision Browser Recording",
     videoPath: "/data/Case3_MiVision_Browser_Recording.webm"
    },
    {
     id: "art-14",
     type: "file",
     label: "Replacement Card Request Confirmation",
     pdfPath: "/data/Case3_Replacement_Card_Request_Confirmation.pdf"
    }
   ]
  },
  {
   id: "step-10",
   title_p: "Drafting confirmation email and logging case...",
   title_s: "Confirmation Drafted, Case Logged & SM Notified",
   isHitl: true,
   reasoning: [
    "Pace drafted the client confirmation email to Priya Nair: name updated to Eleanor Sutherland effective 9 March 2026, replacement card in progress, old card remains active until new card is activated, delivery address confirmation requested.",
    "Full document audit trail logged to CRM case CSC-2026-0309-HSF-0314: both documents received, extraction summaries, validation links, and MiVision update timestamp all on record.",
    "SM David Mensah notified: one open item remaining -- replacement card delivery address. SM to approve confirmation email before sending."
   ],
   artifacts: [
    {
     id: "art-15",
     type: "email_draft",
     label: "Confirmation Email Draft",
     data: {
      from: "David Mensah -- HSBC Commercial Cards <d.mensah@hsbc.com>",
      to: "Priya Nair <priya.nair@hsf.com>",
      subject: "RE: Name change -- Eleanor Whitfield-Osei, card 2847 -- completed",
      body: "Hi Priya,\n\nGood news -- we've completed the name change for Eleanor. Here's a summary of what's been updated:\n\n  Name updated to:    Eleanor Sutherland\n  Card ending:        ....2847\n  Effective from:     Today (9 March 2026)\n\n────────────────────────────────────────────────────\nREPLACEMENT CARD\n────────────────────────────────────────────────────\n\nWe've also initiated a replacement card with Eleanor's new name embossed (E SUTHERLAND). Before we can confirm the delivery address, could you let us know where you'd like the card sent?\n\nIf it should go to Eleanor's usual office address we can confirm that from our records -- just say the word.\n\nThe old card (ending 2847, name E WHITFIELD-OSEI) will remain active until the new card is activated, so there will be no interruption to Eleanor's card usage during the transition.\n\nReplacement card reference: CRD-2026-0309-28471\nExpected lead time: 5-7 business days from delivery address confirmation.\n\n────────────────────────────────────────────────────\n\nIf you have any questions, don't hesitate to get in touch.\n\nKind regards,\nDavid Mensah\nSenior Card Consultant | HSBC Commercial Cards\nd.mensah@hsbc.com | +44 20 7991 8847\nHSBC Bank plc | 8 Canada Square, London E14 5HQ",
      isIncoming: false,
      isSent: false
     }
    },
    {
     id: "art-16",
     type: "file",
     label: "CRM Case Log",
     pdfPath: "/data/Case3_CRM_Case_Log.pdf"
    }
   ]
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
   await updateProcessListStatus(PROCESS_ID, isFinal ? "Needs Review" : "Needs Attention", "Draft Review: Email Pending");

   // Wait for SM David Mensah to review and click Send
   await waitForEmail(PROCESS_ID);

   // After SM sends: mark as completed
   updateProcessLog(PROCESS_ID, {
    id: step.id,
    title: step.title_s,
    status: "completed",
    reasoning: step.reasoning || [],
    artifacts: step.artifacts || []
   });

   if (isFinal) {
    await updateProcessListStatus(PROCESS_ID, "Done", "Done -- replacement card delivery address pending");
   } else {
    await updateProcessListStatus(PROCESS_ID, "In Progress", step.title_s);
   }
   await delay(1500);
  } else {
   // Normal step: stream reasoning then complete
   updateProcessLog(PROCESS_ID, {
    id: step.id,
    title: step.title_s,
    status: isFinal ? "completed" : "success",
    reasoning: step.reasoning || [],
    artifacts: step.artifacts || []
   });
   await updateProcessListStatus(PROCESS_ID, isFinal ? "Done" : "In Progress", isFinal ? "Done -- replacement card delivery address pending" : step.title_s);
   await delay(1500);
  }
 }

 console.log(`${PROCESS_ID} Complete: ${CASE_NAME}`);
})();
