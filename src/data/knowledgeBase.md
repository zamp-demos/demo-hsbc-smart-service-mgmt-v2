# HSBC Commercial Cards — Pace Intelligent Case Resolution
## Service Manager Knowledge Base

**Classification:** Internal — Confidential — Demo Environment
**Version:** 1.0
**Prepared by:** Zamp (Varni Labs Pte. Ltd.)
**Date:** 2026-03-09
**Purpose:** This knowledge base is the authoritative reference for the Pace Service Manager assistant. It contains complete case data, system knowledge, policy rules, entity records, and a comprehensive Q&A thread library. The code generation agent must use this document to hard-code all question-and-answer pairs in the SM chat interface.

---

## Table of Contents

1. [Knowledge Base Purpose & Scope](#1-knowledge-base-purpose--scope)
2. [Pace Platform — Complete Technical Reference](#2-pace-platform--complete-technical-reference)
3. [HSBC Systems Landscape](#3-hsbc-systems-landscape)
4. [Policy Compendium](#4-policy-compendium)
5. [People & Entities Directory](#5-people--entities-directory)
6. [Case 1 — Complete Record: Three Requests in One Email](#6-case-1--complete-record-three-requests-in-one-email)
7. [Case 2 — Complete Record: Routine Limit Increase Uncovers Fraud Alert](#7-case-2--complete-record-routine-limit-increase-uncovers-fraud-alert)
8. [Case 3 — Complete Record: Cardholder Name Change — Three-Document Identity Chain](#8-case-3--complete-record-cardholder-name-change--three-document-identity-chain)
9. [Reference Numbers Master Index](#9-reference-numbers-master-index)
10. [Regulatory Framework](#10-regulatory-framework)
11. [Knowledge Base Entries — Learned Patterns](#11-knowledge-base-entries--learned-patterns)
12. [SM Q&A Thread Library — Case 1](#12-sm-qa-thread-library--case-1)
13. [SM Q&A Thread Library — Case 2](#13-sm-qa-thread-library--case-2)
14. [SM Q&A Thread Library — Case 3](#14-sm-qa-thread-library--case-3)
15. [SM Q&A Thread Library — Cross-Case & Platform Questions](#15-sm-qa-thread-library--cross-case--platform-questions)
16. [SM Decision Trees](#16-sm-decision-trees)
17. [Glossary](#17-glossary)

---

## 1. Knowledge Base Purpose & Scope

### 1.1 What This Knowledge Base Is

This document is the single authoritative reference for the Pace SM Assistant — an AI-powered conversational interface that Service Managers (SMs) at HSBC Commercial Cards can use to query the status of any case, understand what Pace has done and why, review decisions, interrogate system findings, and navigate complex regulatory or policy questions.

The SM Assistant is not a general chatbot. It is a precision tool grounded entirely in this knowledge base and the live case data it references. Every answer the SM Assistant gives must be traceable to a specific case record, system output, policy rule, or regulatory provision contained in this document.

### 1.2 How the Codegen Agent Should Use This File

The codegen agent must read this entire document and use it to:

- Hard-code all factual Q&A pairs in Section 12–15 as pre-built responses in the SM chat interface
- Use the case records in Sections 6–8 as the data layer behind all case-specific questions
- Use the system descriptions in Section 3 as the knowledge layer behind all "what is" and "how does" questions
- Use the policy rules in Section 4 as the authority behind all "why did Pace decide" questions
- Use the entity directory in Section 5 to resolve all "who is" questions
- Use the regulatory framework in Section 10 to handle all compliance and legal questions
- Use the Q&A threads in Sections 12–15 as the canonical response library — questions not in this library should fall back to the general Pace platform knowledge in Section 2

### 1.3 Tone & Response Style

The SM Assistant should respond in the following style:
- Direct and factual — never hedge unnecessarily
- Past tense for things Pace has already done ("Pace retrieved...", "Pace detected...")
- Present tense for current status ("The alert is open", "The case is pending SM approval")
- Future tense for pending actions ("Once the fraud alert is resolved, Pace will draft...")
- Numbers always precise — no rounding unless the source data is rounded
- Timestamps always in GMT, format: HH:MM GMT or YYYY-MM-DD HH:MM GMT
- Reference numbers always quoted in full — never abbreviated
- Never say "I think" or "I believe" — the SM Assistant speaks with authority grounded in this knowledge base
- If a question is outside the scope of this knowledge base, say so explicitly: "That question is outside my current case knowledge. Please check [system name] directly."

---

## 2. Pace Platform — Complete Technical Reference

### 2.1 What Pace Is

Pace is Zamp's agentic AI platform deployed at HSBC Commercial Cards as the intelligent core of the Service Hub. Pace receives inbound PA (Programme Administrator) emails, processes them end-to-end with minimal SM involvement, executes changes in HSBC systems, and delivers complete, ready-to-send client responses to SMs for final review.

Pace is not a robotic process automation (RPA) tool. It does not follow rigid scripted workflows. Pace reasons about each case from first principles, applies programme policy, consults multiple systems, detects anomalies that a scripted tool would miss, and escalates to humans only when the situation genuinely requires human judgment.

### 2.2 Pace's Seven Core Primitives

Pace operates through seven core primitives. Every action Pace takes in a case is one of these seven types:

| Primitive | Symbol | Description |
|---|---|---|
| **Reading** | 📧 | Pace reads and parses incoming emails, identifying the sender, verifying their identity against CRM, extracting structured request data from unstructured text, and classifying request types |
| **Reasoning** | 🧠 | Pace applies policy rules, compares extracted data against system records, constructs logical arguments, evaluates risk, and makes decisions — including decisions to escalate |
| **Browser Agent** | 🌐 | Pace operates web browsers autonomously to execute changes in MiVision, submit forms, and retrieve data from browser-based systems where no API is available |
| **Navigation** | 🔗 | Pace queries structured system APIs (CRM, Auth Platform, SAS Fraud Management, Smart Data OnLine) to retrieve records without browser automation |
| **Drafting** | ✍️ | Pace writes client-facing emails, internal notifications, escalation briefs, FDAR submissions, and SM decision prompts — all calibrated for regulatory compliance and the appropriate tone |
| **Document Ingestion** | 📄 | Pace reads, interprets, and extracts structured data from PDFs — including identity documents (passports, marriage certificates, deed polls), invoices, and supporting documents |
| **Human-in-the-Loop (HITL)** | 🤝 | Pace presents decision prompts to SMs when it encounters novel patterns, regulatory sensitivity, or situations requiring human judgment — presenting structured options with a recommendation |

### 2.3 How Pace Decides When to Escalate to HITL

Pace invokes HITL when any of the following conditions are met:

1. **Novel pattern** — The situation matches no existing knowledge base entry and contains elements Pace has not encountered before in combination
2. **Regulatory sensitivity** — The action or communication required has direct exposure to financial crime law (POCA, MLR), sanctions law, or data protection law (GDPR/UK GDPR)
3. **Competing policy rules** — Two or more policy rules apply and point in different directions
4. **Above auto-approve ceiling** — A requested change exceeds the financial threshold at which Pace is authorised to act without SM sign-off
5. **Active compliance flag** — Any account with an active fraud alert, sanctions match, or open regulatory investigation requires SM awareness before action
6. **Irreversible action risk** — Actions that cannot be undone (card cancellation, account suspension) always require SM confirmation

When Pace invokes HITL, it always:
- Summarises the full investigation findings to that point
- Presents 2–3 clearly labelled options
- Identifies a recommended option with rationale
- Flags any regulatory risks associated with each option
- Records the SM's selection and the time taken to decide
- Writes the decision to the knowledge base if it is the first time this pattern has been seen

### 2.4 How Pace Handles Data Access Restrictions

Some HSBC systems have controlled data access layers that require explicit authorisation before Pace can retrieve information. Pace handles these automatically:

**External data gates (client-side):** When a client programme has not configured data distribution for a third-party data service (e.g., Mastercard Smart Data OnLine CDF3 distribution not configured), Pace files the appropriate access request form autonomously, notifies the correct authoriser at the client organisation, and continues processing other tasks in parallel while waiting for approval. Upon receiving approval, Pace resumes the blocked task automatically.

**Internal data gates (regulatory):** When accessing controlled HSBC data (e.g., SAS Fraud Management records, which are classified under IFI-POL-2023), Pace files an internal data access request (such as a Fraud Data Access Request / FDAR) to the appropriate internal authority, sends a notification, and continues parallel tasks while waiting. Upon receiving approval, Pace resumes the blocked query.

In both cases, Pace never exceeds its authorised access scope and logs every access event to the case record.

### 2.5 Pace's Self-Learning Mechanism

When Pace encounters a novel situation and invokes HITL, and the SM makes a decision, Pace writes a Knowledge Base Entry (KBE) capturing:

- The pattern that triggered HITL (all trigger conditions)
- The options that were presented
- The SM's selection
- The rationale behind the recommended option
- Any regulatory flags that constrain future behaviour
- The future behaviour Pace will adopt when this pattern recurs

On the next occurrence of the same pattern, Pace executes the recorded option automatically without invoking HITL, and notifies the SM that it has acted, citing the knowledge base entry as authority. This means Pace becomes faster and more autonomous over time as SMs train it through their decisions.

### 2.6 Pace's Audit Trail

Every action Pace takes is logged to the case record in full, including:
- The precise timestamp (GMT) of every action
- The system queried or acted upon
- The data retrieved or changes made
- The reference number of every form filed, change applied, or notification sent
- The elapsed time between steps
- Any waits (for approvals, for PA responses) counted separately from Pace processing time
- The SM's name and timestamp for every action requiring SM involvement

This audit trail is fully available to SMs in the case dashboard and is designed to satisfy HSBC's internal compliance requirements for operational record-keeping.

### 2.7 What Pace Does Not Do

- Pace does not make decisions on fraud investigations — it detects, reports, and escalates
- Pace does not communicate directly with cardholders — all client-facing communication goes through the SM
- Pace does not disclose details of active fraud investigations to PAs or cardholders (POCA compliance)
- Pace does not execute irreversible actions (card cancellation, fraud blocks) without explicit SM confirmation
- Pace does not modify its own knowledge base entries once written — changes require SM review
- Pace does not exceed its authorised data access scope at any time

---

## 3. HSBC Systems Landscape

### 3.1 MiVision

**Type:** Self-service cardholder management portal
**Owner:** HSBC Commercial Cards
**Access method:** Browser (Pace uses Browser Agent primitive)
**Primary purpose:** The central system of record for commercial card accounts. SMs and PAs use MiVision to view and manage cardholder details, card status, spending limits, travel notifications, card replacement, PIN reissue, and programme-level reporting.

**What MiVision CAN do:**
- Display full cardholder profile (name, role, card type, card status, card expiry)
- Show current spending limit (permanent and any active temporary limits)
- Show MTD (month-to-date) balance and available credit
- Show 18-month transaction history summary
- Show internal flags (e.g., fraud review flags linked to SAS alerts)
- Allow travel region activation (by country code, for specified date ranges)
- Allow temporary limit amendments (queued for policy-based approval)
- Allow permanent limit amendments (subject to credit committee approval thresholds)
- Allow card replacement requests (subject to delivery address confirmation)
- Allow name/details amendments (subject to identity document verification)
- Generate bespoke spend reports (limited data — not Level 3)
- Bulk file upload for programme administrators
- PIN reissue

**What MiVision CANNOT do (where Pace adds value):**
- Explain why a card was declined (requires Auth Platform query)
- Apply policy reasoning to auto-approve or reject requests
- Cross-reference Mastercard Smart Data OnLine for Level 3 spend analytics
- Check SAS Fraud Management for open alerts
- Handle multi-part PA email queries end-to-end
- Draft complete, policy-compliant client responses
- Ingest and verify identity documents
- Construct identity name chains across multiple documents
- File Mastercard data distribution request forms
- Detect process gaps in the fraud alert queue

**Internal flags in MiVision:** MiVision displays internal flags when a linked alert exists in SAS Fraud Management. The flag text is typically "Account flagged for review — see linked alert." The flag does not show the alert detail — the SM or Pace must query SAS directly (subject to FDAR approval where required).

### 3.2 Mastercard Smart Data OnLine™

**Type:** Enhanced transaction data platform (third-party — Mastercard)
**Owner:** Mastercard (hosted); licensed to HSBC Commercial Cards
**Access method:** API with programme-level authorisation
**Primary purpose:** Provides Level 2 and Level 3 enhanced transaction data for commercial card programmes. Level 3 data includes line-item purchase detail, commodity codes, GL codes, merchant tax ID, and quantity/unit price breakdowns — far richer than the basic transaction records available in MiVision or the Auth Platform.

**Data levels explained:**
- **Level 1:** Basic transaction data — merchant name, date, amount, card number. Available universally.
- **Level 2:** Enhanced data — merchant category code, merchant address, tax amount, customer reference. Requires merchant to submit Level 2 data.
- **Level 3:** Full line-item detail — GL codes, commodity codes, unit prices, quantities, purchase order number, tax breakdown. Requires merchant to submit Level 3 data and programme to have CDF3 distribution configured.

**CDF3 Distribution:** This is the configuration that enables a commercial card programme to receive Level 3 data. Not all programmes have it configured. When CDF3 is not configured, Pace files a Mastercard SD-DDR-2024 (Smart Data — Data Distribution Request) form to request access. The form requires authorisation from the client's designated Smart Data Administrator.

**Smart Data Admin:** Each Aon/client organisation that uses Smart Data OnLine™ designates a Smart Data Administrator — typically someone in finance or IT. This person's email is registered at the programme level. For Aon, the Smart Data Admin email is smartdata.admin@aon.com.

### 3.3 SAS Fraud Management

**Type:** Fraud detection and risk scoring system
**Owner:** HSBC (SAS co-developed, deployed across HSBC UK, Asia, and US)
**Access method:** API — controlled data under IFI-POL-2023 (Fraud Data Access Request required)
**Primary purpose:** Real-time transaction scoring and fraud alert generation. Every transaction on every HSBC commercial card is scored by SAS. When a score exceeds defined thresholds, an alert is raised and placed in the Fraud Operations queue for analyst review.

**Score thresholds:**
- **0–49:** Low risk — no alert
- **50–74:** Medium risk — alert raised, placed in queue for review (not urgent)
- **75–84:** High risk — alert raised, urgent review flag
- **85–100:** Critical — auto-block triggered, card suspended pending investigation

**Alert triggers (common):** New merchant category (no prior history in 18 months), off-hours transactions (outside cardholder's historical pattern), high MTD velocity (significantly above 18-month average), multiple transactions at same new merchant in short period, geographic anomaly, MCC mismatch with stated card purpose.

**Alert lifecycle:** When SAS raises an alert, it is placed in the Fraud Operations queue. An analyst is expected to review, assign, and action the alert within SLA. If the alert is not actioned within 24 hours, it is considered to have fallen through the queue (a process gap). Pace detects these queue gaps when it accesses SAS records — the alert's "assigned to" field will be blank and no CRM case will exist.

**FDAR (Fraud Data Access Request):** SAS records are classified as controlled data under IFI-POL-2023 (HSBC Internal Fraud Investigation Policy). Any system or person seeking to access SAS alert records must file a FDAR with the Fraud Operations Duty Manager. FDAR requests state: the card being queried, the business reason, the access type (read-only), POCA compliance acknowledgement, and urgency. FDARs are typically approved same-day for active cardholder requests.

**POCA implications:** Once Pace accesses a SAS alert, POCA 2002 tipping-off provisions apply to all client-facing communication drafted while the alert is open. Pace will not include any reference to fraud, suspicious activity, or the alert in PA-facing or cardholder-facing communications until Fraud Operations has completed its review and either cleared or actioned the alert.

### 3.4 HSBC Authorisation Platform

**Type:** Card authorisation and transaction history system
**Owner:** HSBC
**Access method:** API
**Primary purpose:** Records every authorisation event on every HSBC commercial card — both approved and declined. The Auth Platform is the definitive record of decline codes, decline reasons, and the real-time state of a card at the moment of any given transaction attempt.

**Decline codes (key):**
- **Code 05:** Do not honour — generic decline, multiple possible causes
- **Code 14:** Invalid card number
- **Code 41:** Lost card
- **Code 43:** Stolen card
- **Code 51:** Insufficient funds / over limit
- **Code 54:** Expired card
- **Code 57:** Transaction not permitted to cardholder — geographic restriction active (most common for commercial cards with travel controls)
- **Code 61:** Exceeds withdrawal frequency limit
- **Code 65:** Exceeds withdrawal amount limit

**SAS score at auth time:** The Auth Platform records the SAS fraud score at the moment of each authorisation attempt. This allows Pace to confirm whether a decline was fraud-related or restriction-related. A low SAS score (e.g., 22/100) at the time of a Code 57 decline confirms the decline was a geographic control, not a fraud intervention.

### 3.5 HSBC CRM System

**Type:** Customer Relationship Management system
**Owner:** HSBC Commercial Banking
**Access method:** API
**Primary purpose:** The central repository for all client relationships, PA records, cardholder records, case histories, and SM notes. Pace queries the CRM at the start of every case to verify PA identity, retrieve programme details, identify the assigned SM, and check for any open cases or flags on the relevant account.

**PA verification process:** Pace checks the inbound email sender address against the CRM record for the relevant programme. If the sender domain matches the registered PA domain and the name matches the PA record, the PA is verified. If there is any mismatch, Pace flags it for SM review before proceeding.

**Case logging:** Pace creates a CRM case at the start of every interaction and updates it throughout the case lifecycle. The final case log is a complete audit trail of every action, reference, and timestamp.

**SM assignment:** The CRM holds the SM assigned to each programme. Pace retrieves this at case creation and routes all SM notifications and HITL prompts to the correct SM.

### 3.6 HSBC Internal Request System

**Type:** Internal workflow and ticketing system
**Owner:** HSBC Operations
**Access method:** Browser (Pace uses Browser Agent primitive)
**Primary purpose:** Used to file internal requests that require approval from another HSBC team — including Fraud Data Access Requests (FDARs), IT access requests, compliance reviews, and escalations between business units.

---

## 4. Policy Compendium

### 4.1 POL-AON-UK-2026 — Aon plc (UK) Programme Policy

**Effective from:** 1 January 2026
**Programme:** AON-UK-CC-0047 — Aon plc (UK)
**Policy holder:** HSBC Commercial Cards — Programme Management

#### 4.1.1 Travel Region Controls

- All cardholders on the Aon programme have geographic spending restrictions active by default
- Approved travel regions are configured at the cardholder level in MiVision
- **OECD member countries:** Auto-approve for travel activation — no PA authority letter required. PA email confirmation of travel is sufficient. Current OECD members relevant to APAC travel include Singapore (since 2024), Japan, South Korea, Australia, New Zealand.
- **Non-OECD countries:** Require written PA authority (email confirmation from registered PA is accepted as written authority) before travel regions can be activated. Hong Kong is non-OECD.
- **Travel activation duration:** Maximum 90 days per request. Standard practice is to align with stated itinerary duration plus 3 days buffer.
- **Auto-revert:** MiVision is configured to auto-revert travel regions to prior settings on the expiry date.

#### 4.1.2 Temporary Limit Amendments

- **Auto-approve ceiling by role:**
  - Analyst/Associate: GBP 15,000 temporary limit
  - Manager/Senior Manager: GBP 20,000 temporary limit
  - Director: GBP 30,000 temporary limit
  - Managing Director/C-Suite: GBP 40,000 temporary limit
- **Sophia Chen is an MD:** Auto-approve ceiling is GBP 40,000
- **GBP 35,000 requested:** Within MD ceiling — auto-approved
- **SM sign-off required:** Temporary limits above the role ceiling but below GBP 60,000
- **Credit Committee required:** Above GBP 60,000 permanent, or above GBP 100,000 temporary
- **Auto-revert:** Temporary limits must have a stated end date. Pace sets auto-revert on MiVision aligned with the stated purpose (e.g., end of APAC roadshow)
- **7-point checklist for auto-approve:**
  1. Requested amount within role ceiling? ✅
  2. No active fraud alerts on the account? ✅
  3. No active sanctions matches? ✅
  4. MTD utilisation below 95%? ✅
  5. No overdue payments in last 12 months? ✅
  6. Requested amount consistent with stated purpose? ✅
  7. Programme-level credit facility has headroom? ✅

#### 4.1.3 Smart Data Reporting

- Preferred report format: Excel with Aon standard template (date, merchant, city, country, MCC, MCC description, amount, cost centre, GL code, data level)
- Cost centre codes follow Aon internal chart: CC-TRAVEL (travel), CC-CLIENT (client entertainment), CC-OFFICE (office supplies), CC-FX (foreign exchange), CC-ENTERTAIN (entertainment)
- Level 3 data preferred; Level 2 accepted where Level 3 not available

### 4.2 POL-CC-UK-2026 — Clifford Chance LLP Programme Policy

**Effective from:** 1 January 2026
**Programme:** CC-PROG-UK-0112 — Clifford Chance LLP
**Policy holder:** HSBC Commercial Cards — Programme Management

#### 4.2.1 Temporary Limit Amendments

- **Auto-approve ceiling by role:**
  - Associate/Paralegal: GBP 10,000
  - Senior Associate/Manager: GBP 20,000
  - Partner/Director: GBP 30,000
  - Head of Department/Managing Partner: GBP 35,000
- **Richard Okafor is Head of Technology:** Auto-approve ceiling is GBP 35,000
- **GBP 45,000 requested:** Above ceiling — SM approval required
- **Section 6.1.4 — Fraud Alert Hard Block:** No limit amendment (temporary or permanent, increase or decrease) may be processed on any account with an active, unresolved fraud alert. This block applies regardless of the requested amount, the cardholder's role, or the stated purpose. The block can only be lifted by Fraud Operations formally closing or clearing the alert.
- **SM sign-off range:** GBP 35,001 to GBP 60,000 temporary
- **Credit Committee required:** Above GBP 60,000 temporary

#### 4.2.2 Fraud Alert Protocol

- Upon discovery of an unactioned fraud alert, the SM must be notified immediately
- The PA must receive a holding response within the same business day — no fraud disclosure
- Fraud Operations must be formally notified of any queue gap (alert unactioned >24 hours)
- No limit amendment may proceed until Fraud Operations formally clears the alert

#### 4.2.3 POCA Tipping-Off (Section 6.2.1)

- Policy explicitly prohibits any communication to PAs, cardholders, or third parties that discloses the existence, content, or status of a fraud alert or investigation
- This prohibition applies from the moment a fraud alert is accessed until Fraud Operations formally clears the alert
- Breach of this prohibition may constitute a criminal offence under POCA 2002, Sections 333A–333E
- All holding responses drafted while a fraud alert is active must be reviewed for POCA compliance before sending

### 4.3 POL-HSF-UK-2026 — Herbert Smith Freehills LLP Programme Policy

**Effective from:** 1 January 2026
**Programme:** HSF-PROG-UK-0089 — Herbert Smith Freehills LLP
**Policy holder:** HSBC Commercial Cards — Programme Management

#### 4.3.1 Name Change Protocol

- Name changes require primary identity document verification — a passport, driving licence, or birth certificate
- Where a name change involves more than one step (e.g., multiple prior marriages, deed poll changes), a complete identity chain must be established before any change is executed
- Each link in the identity chain must be supported by a separate primary document
- The identity chain is: [name as enrolled in MiVision] → [name on most recent document supplied] — all intermediate steps must be bridged by a document
- **Document precedence:** Passport > Driving licence > Birth certificate > Deed poll + statutory declaration
- MRZ validation is required on all passport documents before the name change is executed
- If a discrepancy is detected at any point in the chain, Pace must pause, request the bridging document, and not execute any changes until the chain is complete
- The replacement card must be initiated automatically upon name change — old card remains active until new card is activated

#### 4.3.2 Identity Document Logging

- All identity documents verified in connection with a name change must be logged to the cardholder's MiVision record
- Document type, document number, issuing authority, and expiry date must be recorded
- Pace must create an entry in the name change history in MiVision referencing both documents

---

## 5. People & Entities Directory

### 5.1 HSBC Staff

| Name | Role | Email | Cases Involved |
|---|---|---|---|
| David Mensah | Senior Card Consultant (SM) | d.mensah@hsbc.com | Case 1 (AON), Case 3 (HSF) |
| Sarah Okonkwo | Senior Card Consultant (SM) | s.okonkwo@hsbc.com | Case 2 (Clifford Chance) |
| T. Osei | Fraud Operations Duty Manager | t.osei@hsbc.com | Case 2 — FDAR approver |

### 5.2 Client Contacts — Case 1 (Aon plc)

| Name | Role | Email | Organisation |
|---|---|---|---|
| Rachel Griffiths | Commercial Cards Programme Administrator (PA) | rachel.griffiths@aon.com | Aon plc |
| P. Nair | Global Smart Data Administrator | p.nair@aon.com | Aon plc |
| Sophia Chen | Managing Director — Strategic Advisory | — | Aon plc |

### 5.3 Client Contacts — Case 2 (Clifford Chance LLP)

| Name | Role | Email | Organisation |
|---|---|---|---|
| James Holroyd | Commercial Cards Programme Administrator (PA) | james.holroyd@cliffordchance.com | Clifford Chance LLP |
| Richard Okafor | Head of Technology — IT & Infrastructure | — | Clifford Chance LLP |

### 5.4 Client Contacts — Case 3 (Herbert Smith Freehills LLP)

| Name | Role | Email | Organisation |
|---|---|---|---|
| Priya Nair | Commercial Cards Programme Administrator (PA) | priya.nair@hsf.com | Herbert Smith Freehills LLP |
| Eleanor Whitfield-Osei | Senior Associate — Corporate Finance | — | Herbert Smith Freehills LLP |
| Eleanor Sutherland | Post-marriage name for Eleanor Whitfield-Osei | — | Herbert Smith Freehills LLP |

### 5.5 Card Details

| Cardholder | Card (Last 4) | Card Type | Programme | Current Limit |
|---|---|---|---|---|
| Sophia Chen | ••••4421 | Corporate Card | AON-UK-CC-0047 | GBP 35,000 (temp, reverts to 25,000 on 30 Mar) |
| Richard Okafor | ••••7732 | Purchasing Card (P-Card) | CC-PROG-UK-0112 | GBP 20,000 (limit increase blocked — active fraud alert) |
| Eleanor Sutherland | ••••2847 | Corporate Card | HSF-PROG-UK-0089 | GBP 15,000 |

### 5.6 Organisations

| Organisation | Programme ID | SLA Tier | SM | Address |
|---|---|---|---|---|
| Aon plc (UK) | AON-UK-CC-0047 | Priority | David Mensah | 122 Leadenhall Street, London EC3V 4AN |
| Clifford Chance LLP (UK) | CC-PROG-UK-0112 | Priority | Sarah Okonkwo | 10 Upper Bank Street, London E14 5JJ |
| Herbert Smith Freehills LLP (UK) | HSF-PROG-UK-0089 | Standard | David Mensah | Exchange House, Primrose Street, London EC2A 2EG |

---

## 6. Case 1 — Complete Record: Three Requests in One Email

### 6.1 Case Identity

| Field | Value |
|---|---|
| Case ID | CSC-2026-0309-AON-0847 |
| Date | 2026-03-09 |
| Programme | AON-UK-CC-0047 — Aon plc (UK) |
| PA | Rachel Griffiths — rachel.griffiths@aon.com |
| Cardholder | Sophia Chen — card ••••4421 |
| SM | David Mensah — d.mensah@hsbc.com |
| Case Type | Multi-request — PA Email |
| Total Elapsed | 18 min 04 sec |
| Pace Processing Time | 11 min 51 sec |
| Wait Time | 6 min 13 sec (Smart Data access approval) |
| SLA Status | PASS — within Priority window |
| Final Status | COMPLETE — pending SM review and send |

### 6.2 The Inbound Email

**From:** rachel.griffiths@aon.com
**To:** hsbc.commercialcards.uk@hsbc.com
**Received:** 2026-03-09 14:03:08 GMT
**Subject:** Three things — Sophia Chen card 4421

**Three requests extracted by Pace:**
1. Card ••••4421 declined at Marina Bay Sands Hotel, Singapore, on 2026-03-08 at 19:47 SGT. Cardholder is MD Strategic Advisory heading to APAC for 3-week roadshow. Request: investigate and fix.
2. Q1 2026 spend breakdown for Sophia's card for internal audit — merchant-level detail and cost centre codes required.
3. Temporary limit increase from GBP 25,000 to GBP 35,000 for APAC roadshow (Singapore, Tokyo, Hong Kong).

### 6.3 Step-by-Step Execution

#### Step 1 — Email Parsing & PA Verification (14:03:08–14:03:22 GMT)

- **Primitive:** 📧 Reading
- Pace received email at 14:03:08 GMT
- PA identity verified: sender rachel.griffiths@aon.com matches CRM record for programme AON-UK-CC-0047
- Three distinct requests extracted and classified:
  - Request A: Decline investigation → Card ••••4421 → Auth Platform query required
  - Request B: Q1 spend data → Smart Data OnLine query required
  - Request C: Temporary limit increase GBP 25,000 → GBP 35,000 → Policy check + MiVision amendment
- SM David Mensah identified as assigned SM
- CRM case created: CSC-2026-0309-AON-0847

#### Step 2 — Decline Investigation (14:04:07–14:04:18 GMT)

- **Primitive:** 🔗 Navigation → HSBC Authorisation Platform
- Query: Card ••••4421, decline events, 2026-03-07 to 2026-03-09
- **Result retrieved:**
  - Date: 2026-03-08
  - Time: 19:47 SGT (11:47 GMT)
  - Merchant: Marina Bay Sands Hotel & Resort
  - City: Singapore
  - Country: SGP
  - MCC: 7011 (Hotels and Motels)
  - Amount: GBP 1,840.00 (equiv. SGD 3,128.00)
  - Auth Result: DECLINED
  - Decline Code: 57
  - Decline Reason: Transaction Not Permitted To Cardholder
  - SAS Score at auth time: 22/100 (well below alert threshold of 75)
- **Pace interpretation:** Code 57 = geographic restriction. SGP not in approved travel regions. Not fraud-related (SAS 22/100). Resolution: add SGP to travel regions in MiVision.

#### Step 3 — Cardholder Profile & Policy Load (14:04:19–14:04:55 GMT)

- **Primitive:** 🔗 Navigation → MiVision
- Cardholder record retrieved: Sophia Chen, ••••4421, MD Strategic Advisory, AON-UK-CC-0047
- Current limit: GBP 25,000 permanent
- MTD balance: GBP 9,840.20 (39.4% utilised)
- No fraud flags, no open alerts, no account restrictions
- Programme policy loaded: POL-AON-UK-2026

#### Step 4 — Travel Region Policy Reasoning (14:04:56–14:05:41 GMT)

- **Primitive:** 🧠 Reasoning
- Destinations in PA email: Singapore, Tokyo/Japan, Hong Kong
- **Singapore (SGP):** OECD member since 2024 → Auto-approve. PA email confirmation of travel = sufficient. ✅
- **Japan (JPN):** OECD member → Auto-approve. ✅
- **Hong Kong (HKG):** Non-OECD. Written PA authority required. Rachel's email states travel to HK explicitly → constitutes written PA confirmation → Auto-approve. ✅
- Duration: PA states 3-week roadshow → 21-day activation. Start date: 2026-03-09. End date: 2026-03-30.

#### Step 5 — Limit Increase Reasoning (14:05:42–14:06:20 GMT)

- **Primitive:** 🧠 Reasoning
- Requested amount: GBP 35,000
- Sophia Chen's role: Managing Director — auto-approve ceiling: GBP 40,000
- GBP 35,000 < GBP 40,000 → within auto-approve ceiling ✅
- 7-point checklist: All 7 criteria pass ✅
- **Decision:** Auto-approve. No SM sign-off required.
- Auto-revert date: 2026-03-30 (aligned with travel activation end date)

#### Step 6 — MiVision Changes Execution (14:06:21–14:09:44 GMT)

- **Primitive:** 🌐 Browser Agent → MiVision
- **Change 1 — Travel Regions:**
  - SGP activated — 2026-03-09 to 2026-03-30
  - JPN activated — 2026-03-09 to 2026-03-30
  - HKG activated — 2026-03-09 to 2026-03-30
  - Reference: TRV-2026-0309-44211
  - Applied at: 14:09:44 GMT
- **Change 2 — Temporary Limit:**
  - Previous limit: GBP 25,000
  - New limit: GBP 35,000
  - Valid until: 2026-03-30 (auto-revert)
  - Reference: LIM-2026-0309-44212
  - Applied at: 14:09:44 GMT

#### Step 7 — Smart Data Access Discovery & Form Filing (14:09:44–14:09:52 GMT)

- **Primitive:** 🔗 Navigation → Smart Data OnLine (access check)
- Access attempt for programme AON-UK-CC-0047 → ACCESS RESTRICTION DETECTED
- Reason: No CDF3 distribution configured for this programme
- **Pace response — autonomous:**
  - Filed Mastercard Form SD-DDR-2024
  - Reference: SD-DDR-2026-0309-AON047
  - Filed at: 14:09:52 GMT (8 seconds after discovering the restriction)
  - Authorisation email sent to: smartdata.admin@aon.com (Aon Global Smart Data Admin)
  - CC: rachel.griffiths@aon.com
  - Pace then continued to other tasks (no blocking wait)

#### Step 8 — Smart Data Access Approval (14:22:31 GMT)

- **Primitive:** 📧 Reading
- Approval email received from P. Nair (Aon Global Smart Data Admin) at 14:22:31 GMT
- Wait duration: 6 minutes 13 seconds from form submission
- FDAR reference confirmed: SD-DDR-2026-0309-AON047
- Session resumed for Smart Data query

#### Step 9 — Smart Data Query & Report Generation (14:22:31–14:22:58 GMT)

- **Primitive:** 🌐 Browser Agent → Smart Data OnLine™
- Query: Card ••••4421, Q1 2026 (1 Jan – 31 Mar 2026), Level 3 data
- **Results:**
  - Total transactions: 84
  - Total spend: GBP 21,480.60
  - Level 3 data available: 73% (61 transactions)
  - Level 2 data only: 27% (23 transactions)
  - Average per transaction: GBP 255.72
  - Highest single transaction: GBP 1,200.00 (The Peninsula Hong Kong)
  - Most frequent category: Hotels & Motels (28 transactions)
- Report formatted to Aon preferred template: date, merchant, city, country, MCC, MCC description, amount, cost centre, GL code, data level
- Report saved as: 09_Q1_Spend_Report_Sophia_Chen.pdf (bank statement format)

#### Step 10 — CRM Case Logging & Client Response Drafting (14:21:00–14:21:15 GMT)

- **Primitive:** 🔗 Navigation → HSBC CRM System
- Case CSC-2026-0309-AON-0847 logged with all references
- SLA checked: Priority SLA — PASS
- **Primitive:** ✍️ Drafting
- 3-part client response drafted to Rachel Griffiths:
  - Part 1: Explains Code 57 decline, confirms SGP/JPN/HKG activated, 21-day window, auto-revert 30 March
  - Part 2: Attaches Q1 spend report, 84 transactions, GBP 21,480.60, Level 3 available on 73%
  - Part 3: Confirms limit increased to GBP 35,000, auto-reverts 30 March

### 6.4 SM Action Required

**SM David Mensah:** Review the 3-part client response draft (Artifact 12). The report (Artifact 09) is attached. No investigation required. SM action: review and send. Estimated SM time: under 2 minutes.

### 6.5 Case 1 Key Metrics

| Metric | Value |
|---|---|
| Requests handled | 3 (all in one case) |
| Systems queried | 4 (Auth Platform, MiVision ×2, Smart Data OnLine, CRM) |
| Forms filed autonomously | 1 (SD-DDR-2026-0309-AON047) |
| Changes executed in MiVision | 2 (travel regions, limit increase) |
| HITL invoked | No |
| SM decisions required | 0 (review and send only) |
| Elapsed time (Pace processing) | 11 min 51 sec |
| Elapsed time (total incl. wait) | 18 min 04 sec |

---

## 7. Case 2 — Complete Record: Routine Limit Increase Uncovers Fraud Alert

### 7.1 Case Identity

| Field | Value |
|---|---|
| Case ID | CSC-2026-0309-CC-0291 |
| Date | 2026-03-09 |
| Programme | CC-PROG-UK-0112 — Clifford Chance LLP |
| PA | James Holroyd — james.holroyd@cliffordchance.com |
| Cardholder | Richard Okafor — card ••••7732 |
| SM | Sarah Okonkwo — s.okonkwo@hsbc.com |
| Case Type | PA Email — Limit Request (Exception) |
| Total Elapsed | 14 min 09 sec |
| Pace Processing Time | 8 min 48 sec |
| Wait Time | 5 min 21 sec (FDAR approval) |
| HITL Invoked | Yes — 10:22:03 GMT |
| SM Decision Time | 8 seconds (Option B selected at 10:22:41 GMT) |
| SLA Status | PASS — within Priority window |
| Final Status | PENDING SM — Fraud Operations review in progress |
| Knowledge Base Entry Created | KB-FRAUD-LIMIT-HOLD-001 |

### 7.2 The Inbound Email

**From:** james.holroyd@cliffordchance.com
**To:** hsbc.commercialcards.uk@hsbc.com
**Received:** 2026-03-09 10:08:31 GMT
**Subject:** Temporary limit increase — Richard Okafor, card 7732

**Request:** Temporary limit increase for Richard Okafor (••••7732) from GBP 20,000 to GBP 45,000. Stated purpose: Microsoft Azure cloud licensing invoice (~GBP 38,000) for IT cloud migration project.

### 7.3 Step-by-Step Execution

#### Step 1 — Email Parsing & PA Verification (10:08:31–10:08:49 GMT)

- **Primitive:** 📧 Reading
- PA identity verified: james.holroyd@cliffordchance.com matches CRM for CC-PROG-UK-0112
- Single request extracted: temporary limit increase GBP 20,000 → GBP 45,000
- SM Sarah Okonkwo identified as assigned SM
- CRM case created: CSC-2026-0309-CC-0291
- Programme policy loaded: POL-CC-UK-2026

#### Step 2 — MiVision Profile (10:09:04–10:09:11 GMT)

- **Primitive:** 🔗 Navigation → MiVision
- **Result retrieved:**
  - Cardholder: Richard Okafor, Head of Technology — IT & Infrastructure
  - Card type: Purchasing Card (P-Card)
  - Card status: Active
  - Current limit: GBP 20,000 permanent
  - MTD balance: GBP 17,840.00 (89.2% utilised)
  - Available credit: GBP 2,160.00
  - 18-month average MTD: GBP 8,200.00
  - Current vs average: +117% above 18-month average
  - **CRITICAL: Internal flag detected — "Account flagged for review — see linked alert"**
- **Policy check:**
  - GBP 45,000 requested > GBP 35,000 auto-approve ceiling for Head of Department → SM approval required (independently of fraud flag)
  - **Section 6.1.4 hard block active:** Fraud alert present → limit amendment prohibited until alert is cleared by Fraud Operations
- **Pace decision:** Cannot execute. Must obtain fraud alert details first. Filing FDAR.

#### Step 3 — FDAR Filing (10:08:58–10:09:04 GMT)

- **Note:** Pace filed the FDAR at 10:08:58 GMT — actually slightly before completing the MiVision query, because Pace inferred from the internal flag on MiVision that a FDAR would be needed and began the parallel process
- **Primitive:** 🌐 Browser Agent + ✍️ Drafting → HSBC Internal Request System
- FDAR ticket filed:
  - Reference: FDAR-2026-0309-0441
  - Card: Richard Okafor — ••••7732
  - Programme: Clifford Chance LLP — CC-PROG-UK-0112
  - Access type: Read-only — fraud alert records
  - Business reason: PA limit amendment request — policy Section 6.1.4 requires fraud alert review before any limit action
  - Urgency: High
  - POCA compliance note: Read-only access. No client notification pending Fraud Operations review.
  - Policy authority: IFI-POL-2023
  - Notification sent to: fraudops.dutymanager@hsbc.com at 10:08:58 GMT
- While waiting for FDAR approval, Pace queried the Auth Platform in parallel

#### Step 4 — Auth Platform Query (Parallel to FDAR wait) (10:09:04 GMT)

- **Primitive:** 🔗 Navigation → HSBC Authorisation Platform
- Query: Card ••••7732, all transactions, 2026-03-01 to 2026-03-09, filter: MCC 5000–5999
- **Result — 3 transactions retrieved:**

| Date | Time (GMT) | Merchant | City | MCC | Amount | Auth | SAS Score |
|---|---|---|---|---|---|---|---|
| 2026-03-02 | 19:22 | TECHPOINT SUPPLIES LTD | London EC2 | 5065 | GBP 2,840.00 | APPROVED | 61/100 |
| 2026-03-05 | 20:41 | TECHPOINT SUPPLIES LTD | London EC2 | 5065 | GBP 3,120.00 | APPROVED | 69/100 |
| 2026-03-07 | 21:08 | SIGMA ELECTRONICS TRADE | London E1 | 5065 | GBP 2,940.00 | APPROVED | 74/100 ⚠ ALERT |

- Total: GBP 8,900.00 across 3 transactions
- **MCC 5065** = Electrical Parts & Equipment
- **PA's stated purpose** = Microsoft Azure software (MCC 7372) — MCC mismatch
- All three transactions: off-hours (19:00–22:00 GMT), new merchants, escalating SAS scores

#### Step 5 — FDAR Approval (10:14:19 GMT)

- **Primitive:** 📧 Reading
- FDAR approved by T. Osei (Fraud Operations Duty Manager) at 10:14:19 GMT
- Wait duration: 5 minutes 21 seconds from FDAR submission
- Access granted: Read-only, card ••••7732, 4-hour session
- Audit log: recorded under FDAR-2026-0309-0441

#### Step 6 — SAS Alert Retrieval (10:14:19–10:14:39 GMT)

- **Primitive:** 🌐 Browser Agent → SAS Fraud Management
- **Alert retrieved:**
  - Alert ID: SAS-2026-0307-77321
  - Status: OPEN — NOT ACTIONED
  - Created: 2026-03-07 23:14 GMT (raised immediately after the third transaction)
  - Time unactioned: 48 hours (as of 10:14 GMT on 2026-03-09)
  - Queue: Fraud Operations — UNASSIGNED
  - SAS score: 74/100 (block threshold: 85/100 — card NOT auto-blocked)
  - **Three triggers:**
    1. New MCC category (5065) — no prior MCC 5065 history in 18 months on this card
    2. Off-hours timing — all transactions 19:00–22:00 GMT; 99% of cardholder's 18-month history is 07:00–19:00 GMT
    3. High MTD velocity — GBP 17,840 = 117% above 18-month average of GBP 8,200

#### Step 7 — CRM Queue Gap Check (10:14:39–10:14:52 GMT)

- **Primitive:** 🔗 Navigation → HSBC CRM System
- Check: Any prior cases on ••••7732? Any SM notes in last 30 days? Any Fraud Ops case for alert SAS-2026-0307-77321?
- **Result:**
  - Open cases on ••••7732: None
  - SM notes last 30 days: None
  - PA communications last 30 days: None
  - CRM case for SAS-2026-0307-77321: NOT CREATED
  - SM Sarah Okonkwo notified of alert: NO
  - **PROCESS GAP CONFIRMED:** Alert has been open 48 hours with zero action. No escalation. No SM notification. Alert fell through the queue.

#### Step 8 — Reasoning & HITL Decision (10:14:52–10:22:03 GMT)

- **Primitive:** 🧠 Reasoning
- Five-factor risk matrix:
  1. Open fraud alert → hard policy block Section 6.1.4 (cannot proceed)
  2. GBP 45,000 > GBP 35,000 ceiling → SM approval required independently
  3. MCC 5065 (Electronics) ≠ MCC 7372 (Software/Azure) → stated purpose inconsistent with transaction pattern
  4. MTD 89.2% → compounding exposure if fraud confirmed
  5. 48-hour queue gap → internal process failure requiring escalation
- **Decision:** Novel pattern. Multiple factors. POCA tipping-off risk in drafting. HITL must be invoked.
- HITL prompt sent to SM Sarah Okonkwo at 10:22:03 GMT

#### Step 9 — HITL — SM Decision (10:22:03–10:22:41 GMT)

- **Three options presented to SM:**

| Option | Description | Pace Assessment |
|---|---|---|
| A | Stand down — full manual handoff to SM | Surrenders investigation already built. Inefficient. |
| B ✅ RECOMMENDED | Hold limit, escalate to Fraud Ops, send holding response (no fraud disclosure) | Operationally proportionate and POCA-compliant. |
| C | Decline limit request and notify PA immediately | Premature. Risks POCA tipping-off. Closes request before fraud is resolved. |

- **SM Sarah Okonkwo selected Option B at 10:22:41 GMT** — 8 seconds after the prompt was presented
- **Option B execution — three parallel tracks:**
  1. Fraud Ops notification: Internal notification sent to fraudops.dutymanager@hsbc.com flagging the 48-hour queue gap. CRM case CSC-2026-0309-CC-0291 linked to alert SAS-2026-0307-77321.
  2. Holding response: Neutral holding response drafted to James Holroyd — "short additional review period required" — no fraud disclosure — pending SM approval to send
  3. SM escalation brief: Full priority brief prepared for Sarah Okonkwo with all findings, action checklist, POCA guidance

#### Step 10 — Knowledge Base Entry Written (10:23:09 GMT)

- **Primitive:** 🧠 Self-Learning
- Knowledge base entry KB-FRAUD-LIMIT-HOLD-001 written (see Section 11 for full detail)
- Future behaviour: When this four-trigger pattern next occurs, Pace will auto-execute Option B without HITL and notify SM with KB reference

### 7.4 SM Actions Required

1. Approve the holding response to James Holroyd (Artifact 14) — confirm it does not contain any fraud disclosure
2. Coordinate with Fraud Operations on alert SAS-2026-0307-77321 — confirm they have the case
3. Once Fraud Operations has reviewed and cleared/actioned the alert, decide whether to progress the GBP 45,000 limit request with full SM sign-off
4. If fraud is confirmed: advise James of outcome via appropriate channel (legal team may need to be involved)
5. If transactions cleared: proceed with limit request, apply SM sign-off, notify James

### 7.5 Case 2 Key Metrics

| Metric | Value |
|---|---|
| Requests handled | 1 (with exception path) |
| Systems queried | 5 (MiVision, Auth Platform, SAS, CRM, Internal Request System) |
| FDARs filed | 1 (FDAR-2026-0309-0441) |
| Process gaps detected | 1 (48-hour unactioned fraud alert) |
| HITL invoked | Yes — 10:22:03 GMT |
| SM decision time | 8 seconds |
| Options presented | 3 (Option B selected) |
| KB entries written | 1 (KB-FRAUD-LIMIT-HOLD-001) |
| Parallel processing tracks | 2 (FDAR wait + Auth Platform query) |
| Elapsed time (Pace) | 8 min 48 sec |
| Elapsed time (total) | 14 min 09 sec |

---

## 8. Case 3 — Complete Record: Cardholder Name Change — Three-Document Identity Chain

### 8.1 Case Identity

| Field | Value |
|---|---|
| Case ID | CSC-2026-0309-HSF-0314 |
| Date | 2026-03-09 |
| Programme | HSF-PROG-UK-0089 — Herbert Smith Freehills LLP |
| PA | Priya Nair — priya.nair@hsf.com |
| Cardholder | Eleanor Whitfield-Osei → Eleanor Sutherland — card ••••2847 |
| SM | David Mensah — d.mensah@hsbc.com |
| Case Type | Cardholder Name Change — Document Verification Required |
| Total Elapsed | 31 min 22 sec |
| Pace Processing Time | 12 min 18 sec |
| Wait Time | 19 min 04 sec (PA supplying passport) |
| HITL Invoked | Partial — SM approval required for document request (Step 5) and confirmation email (Step 9) |
| SLA Status | PASS — within Standard window |
| Final Status | DONE — pending SM approval of confirmation email |
| Open Item | Replacement card delivery address (CRD-2026-0309-28471) |

### 8.2 The Inbound Email

**From:** priya.nair@hsf.com
**To:** hsbc.commercialcards.uk@hsbc.com
**Received:** 2026-03-09 14:31:01 GMT
**Subject:** Name change — Eleanor Whitfield-Osei, card 2847
**Attachment:** Eleanor_Sutherland_Marriage_Certificate.pdf (847 KB)

**Request:** Name change for Eleanor Whitfield-Osei (••••2847) following marriage. New legal name: Eleanor Sutherland. Marriage certificate attached.

### 8.3 Step-by-Step Execution

#### Step 1 — Email Parsing & PA Verification (14:31:01–14:31:14 GMT)

- **Primitive:** 📧 Reading
- PA identity verified: priya.nair@hsf.com matches CRM for HSF-PROG-UK-0089
- Request type classified: Name change — document verification required
- One PDF attachment detected: Eleanor_Sutherland_Marriage_Certificate.pdf (847 KB)
- SM David Mensah identified
- CRM case created: CSC-2026-0309-HSF-0314
- **Critical design decision:** Pace did NOT query MiVision at this point. The correct sequence for name changes is: ingest document first → extract legal name → then compare against system record. This prevents the common error of committing to a name change before verifying the document chain.

#### Step 2 — Marriage Certificate Ingestion (14:31:14–14:31:41 GMT)

- **Primitive:** 📄 Document Ingestion
- Source file: Eleanor_Sutherland_Marriage_Certificate.pdf (847 KB)
- Document type identified: UK Marriage Certificate — General Register Office (GRO) format
- Extraction confidence: High (standard GRO layout, all fields present)
- **Fields extracted:**
  - Registration district: London Borough of Kensington and Chelsea
  - Date of marriage: 14 February 2026
  - Bride name BEFORE marriage: **Eleanor Jane Whitfield**
  - Groom name: Kwame Sutherland
  - Bride name AFTER marriage: **Eleanor Jane Sutherland**
  - Bride condition: Divorced
  - Bride profession: Solicitor
  - Witnesses: Margaret Osei, Thomas Whitfield
  - Officiating registrar: R. Patel, District Registrar
  - Certificate reference: KCC-2026-02-14-00471
  - Issuing authority: General Register Office, HMSO

#### Step 3 — MiVision Cardholder Profile & Discrepancy Detection (14:31:41–14:32:01 GMT)

- **Primitive:** 🔗 Navigation → MiVision
- MiVision record retrieved: Eleanor **Whitfield-Osei**, ••••2847
- **DISCREPANCY DETECTED — field-by-field comparison:**
  - Marriage certificate (bride, pre-marriage): Eleanor Jane **Whitfield**
  - MiVision current record: Eleanor **Whitfield-Osei**
  - These are NOT the same name. The hyphenated "-Osei" element is present in MiVision but absent from the certificate's pre-marriage name field.
- **Interpretation:** Eleanor's name has changed at least twice. First: Whitfield → Whitfield-Osei (prior marriage, undocumented in current submission). Second: Whitfield-Osei → Sutherland (current marriage, supported by the certificate supplied).
- **Identity chain status:** INCOMPLETE. The Whitfield → Whitfield-Osei transition is not documented.
- **Pace decision:** Cannot execute name change. Must pause and request bridging document.

#### Step 4 — Document Request Drafting & SM Approval (14:32:01–14:39:22 GMT)

- **Primitive:** ✍️ Drafting
- Pace drafted a document request email to PA Priya Nair
- The draft explains:
  - Exactly which names are inconsistent (Whitfield vs Whitfield-Osei)
  - Why this creates an incomplete identity chain
  - Exactly which document(s) will close the gap (current passport showing Whitfield-Osei, OR deed poll from prior change)
- **Primitive:** 🤝 HITL (SM approval gate)
- Draft sent to SM David Mensah for approval at 14:32:01 GMT
- SM David Mensah approved at 14:39:22 GMT
- Document request email sent to Priya Nair at 14:39:22 GMT
- **CRITICAL:** Pace did NOT execute any MiVision changes at this step. The name change has not been touched.

#### Step 5 — PA Response & Passport Receipt (14:58:26 GMT)

- **Primitive:** 📧 Reading
- PA response received at 14:58:26 GMT — wait: 19 minutes 04 seconds
- Priya confirmed: Eleanor's hyphenated name is from a first marriage. Passport was renewed in 2025 and reflects Whitfield-Osei.
- Attachment received: Eleanor_Whitfield-Osei_Passport.pdf (1.2 MB)
- Pace session resumed

#### Step 6 — Passport Ingestion & MRZ Validation (14:58:26–14:58:44 GMT)

- **Primitive:** 📄 Document Ingestion
- Source file: Eleanor_Whitfield-Osei_Passport.pdf (1.2 MB, 2 pages)
- Document type identified: United Kingdom Passport — HM Passport Office
- **MRZ validation:**
  - MRZ Line 1: P<GBRWHITFIELD-OSEI<<ELEANOR<JANE<<<<<<<<<<<<
  - MRZ Line 2: 5238476109GBR9403146F3503172<<<<<<<<<<<<<<<<<<6
  - Document number check: PASS
  - Date of birth check: PASS
  - Date of expiry check: PASS
  - Composite check digit: PASS
  - **Overall MRZ result: VALID — document integrity confirmed**
- **Fields extracted:**
  - Surname: WHITFIELD-OSEI
  - Given names: ELEANOR JANE
  - Nationality: British Citizen
  - Date of birth: 14 MAR 1994
  - Sex: F
  - Place of birth: LONDON, UNITED KINGDOM
  - Date of issue: 18 MAR 2025
  - Date of expiry: 17 MAR 2035
  - Issuing authority: HM Passport Office
  - Passport number: 523847610
- Extraction confidence: High

#### Step 7 — Identity Chain Construction & Validation (14:58:44–14:59:12 GMT)

- **Primitive:** 🧠 Reasoning
- Three-name identity chain constructed:

| Link | From | To | Evidence | Validation |
|---|---|---|---|---|
| 1 | Eleanor Jane Whitfield | Eleanor Jane Whitfield-Osei | UK Passport 523847610, issued HM Passport Office 2025-03-18, MRZ validated | ✅ VALIDATED |
| 2 | Eleanor Jane Whitfield-Osei | Eleanor Jane Sutherland | Marriage Certificate KCC-2026-02-14-00471, Kensington & Chelsea, 14 Feb 2026 | ✅ VALIDATED |

- **Corroboration checks:**
  - MiVision record name (Whitfield-Osei) matches passport name: ✅ CONSISTENT
  - Date of birth (passport: 14 MAR 1994, MiVision: 14 MAR 1994): ✅ MATCH — same individual confirmed
  - PA's contextual statement ("hyphenated name from first marriage"): ✅ CONSISTENT with documentary evidence
  - Marriage date (14 Feb 2026) vs request date (9 Mar 2026): ✅ 23 days — plausible post-marriage name change timeline
  - Passport validity: Expires 17 Mar 2035 — 9+ years remaining: ✅ VALID
- **CRM clearance check:** No open fraud alerts, no restrictions, no open cases on ••••2847: ✅ CLEAR
- **Identity chain: COMPLETE AND VERIFIED. Pace cleared to execute name change.**

#### Step 8 — MiVision Name Change Execution (14:59:12–15:02:14 GMT)

- **Primitive:** 🌐 Browser Agent → MiVision
- **Changes applied at 15:02:14 GMT:**
  - Surname: Whitfield-Osei → Sutherland
  - Full legal name: Eleanor Jane Whitfield-Osei → Eleanor Jane Sutherland
  - Embossed name on card: E WHITFIELD-OSEI → E SUTHERLAND
  - Identity document logged: UK Passport 523847610 (exp 2035-03-17)
  - Name change history entry created: referencing both documents with dates
  - Replacement card initiated: CRD-2026-0309-28471 (delivery address outstanding)
- Old card ••••2847 remains active until new card is activated — no service interruption

#### Step 9 — Confirmation Drafting & Case Close (15:02:14–15:02:30 GMT)

- **Primitive:** ✍️ Drafting
- Confirmation email drafted to Priya Nair:
  - Name updated to Eleanor Sutherland
  - Replacement card CRD-2026-0309-28471 initiated
  - Old card remains active during transition
  - Delivery address confirmation requested
- SM David Mensah review gate: confirmation pending SM approval before sending
- Case logged to CRM with full document audit trail

### 8.4 SM Actions Required

1. Approve the confirmation email to Priya Nair (Artifact 15)
2. Once PA confirms delivery address — update replacement card request CRD-2026-0309-28471 in MiVision and confirm lead time (5–7 business days)

### 8.5 Why Pace Did NOT Query MiVision Before Ingesting the Document

This is a deliberate design principle, not an oversight. The standard name change workflow at many organisations begins with a MiVision lookup, then asks for the document. Pace inverts this order. The document is the legal source of truth — the name on a document is a fact; the name in a system is a record that may or may not be current. By ingesting the document first and extracting the legal name, Pace ensures it is comparing facts to records — not records to records. This approach also prevents the scenario where a SM assumes the certificate name will match the system name, misses the discrepancy, and executes a name change that creates an incomplete audit trail.

### 8.6 Case 3 Key Metrics

| Metric | Value |
|---|---|
| Documents ingested | 2 (marriage certificate + passport) |
| MRZ validations performed | 1 (passport) |
| Discrepancies detected | 1 (Whitfield vs Whitfield-Osei) |
| Document requests sent | 1 |
| Identity chain links validated | 2 |
| HITL invocations | 2 (document request approval + confirmation email approval) |
| MiVision changes executed | 4 (name, legal name, embossed name, document log) |
| Replacement cards initiated | 1 (CRD-2026-0309-28471) |
| Open items | 1 (delivery address) |
| Pace processing time | 12 min 18 sec |
| Total elapsed time | 31 min 22 sec |

---

## 9. Reference Numbers Master Index

### 9.1 Case References

| Reference | Type | Case | Description |
|---|---|---|---|
| CSC-2026-0309-AON-0847 | CRM Case ID | Case 1 | Aon plc — Rachel Griffiths — 3 requests |
| CSC-2026-0309-CC-0291 | CRM Case ID | Case 2 | Clifford Chance — James Holroyd — limit request exception |
| CSC-2026-0309-HSF-0314 | CRM Case ID | Case 3 | Herbert Smith Freehills — Eleanor name change |

### 9.2 Change References

| Reference | Type | Case | Description |
|---|---|---|---|
| TRV-2026-0309-44211 | MiVision travel activation | Case 1 | SGP, JPN, HKG — 21 days — Sophia Chen ••••4421 |
| LIM-2026-0309-44212 | MiVision limit change | Case 1 | GBP 25,000 → 35,000 temp — Sophia Chen ••••4421 |
| CRD-2026-0309-28471 | MiVision card replacement | Case 3 | Eleanor Sutherland ••••2847 — new name card |

### 9.3 Access Request References

| Reference | Type | Case | Description |
|---|---|---|---|
| SD-DDR-2026-0309-AON047 | Mastercard SD-DDR-2024 form | Case 1 | Smart Data CDF3 access — Aon AON-UK-CC-0047 |
| FDAR-2026-0309-0441 | Fraud Data Access Request | Case 2 | SAS read-only access — card ••••7732 |

### 9.4 Alert & Fraud References

| Reference | Type | Case | Description |
|---|---|---|---|
| SAS-2026-0307-77321 | SAS Fraud Alert | Case 2 | Card ••••7732 — 3 MCC 5065 transactions — 74/100 — 48hrs unactioned |

### 9.5 Document References

| Reference | Type | Case | Description |
|---|---|---|---|
| KCC-2026-02-14-00471 | Marriage Certificate | Case 3 | Kensington & Chelsea — 14 Feb 2026 — Eleanor Whitfield → Sutherland |
| 523847610 | UK Passport | Case 3 | Eleanor Jane Whitfield-Osei — issued 18 Mar 2025 — expires 17 Mar 2035 |

### 9.6 Knowledge Base References

| Reference | Type | Case | Description |
|---|---|---|---|
| KB-FRAUD-LIMIT-HOLD-001 | Knowledge Base Entry | Case 2 | Fraud alert + limit request pattern — Option B protocol |

### 9.7 Report References

| Reference | Type | Case | Description |
|---|---|---|---|
| SD-RPT-2026-Q1-AON047 | Smart Data Report | Case 1 | Q1 2026 spend — Sophia Chen ••••4421 — 84 transactions — GBP 21,480.60 |

---

## 10. Regulatory Framework

### 10.1 Proceeds of Crime Act 2002 (POCA) — Tipping-Off

**Sections 333A–333E** prohibit any person who knows or suspects that a Suspicious Activity Report (SAR) has been submitted — or who is involved in an investigation into money laundering — from disclosing that fact to any person who is or was involved in the suspected offence, or to any other person, in such a way that would prejudice the investigation.

**In the context of Case 2:**
- Alert SAS-2026-0307-77321 is an active fraud alert that may be associated with suspicious transactions
- Once Pace accessed the alert (under FDAR-2026-0309-0441), POCA tipping-off provisions applied to all communications
- Any communication to James Holroyd (PA) or Richard Okafor (cardholder) that discloses: (a) the existence of the alert, (b) the suspicious transactions, (c) that a fraud investigation is underway, (d) that the limit request is being blocked for fraud-related reasons — could constitute a criminal tipping-off offence
- **The holding response (Artifact 14)** was drafted to comply with this: it references only "a short additional review period" with no fraud disclosure
- **Option C in the HITL prompt** (declining the limit request with immediate notification to PA) was flagged as "legally risky — POCA tipping-off" because declining and citing a fraud-related reason would effectively disclose the investigation

**When does POCA risk end?** Once Fraud Operations formally closes, clears, or formally escalates the alert (e.g., to a SAR submission), Pace may communicate more fully with the PA — but the SM and legal team must determine appropriate disclosure at that point.

### 10.2 IFI-POL-2023 — HSBC Internal Fraud Investigation Policy

This internal HSBC policy classifies SAS Fraud Management alert records as controlled data. The policy requires that any system or individual seeking to access these records must obtain approval from the Fraud Operations Duty Manager via a formal Fraud Data Access Request (FDAR). The FDAR process was established to prevent inappropriate access to fraud investigation data, protect ongoing investigations from compromise, and maintain a clear audit trail of who accessed fraud records and why.

**Key provisions relevant to the demo:**
- Read-only access is the standard grant for operational queries (as in Case 2)
- The FDAR must state the business reason, card reference, access type, and POCA compliance acknowledgement
- Access is time-limited (typically 4 hours for operational queries)
- All access is logged to the FDAR ticket and to the case record

### 10.3 Mastercard Smart Data OnLine — CDF3 Distribution Requirements

CDF3 (Card Data Feed 3) is Mastercard's Level 3 enhanced data distribution mechanism. For a commercial card programme to receive Level 3 data, the programme must have an active CDF3 distribution agreement. Programmes that have never configured this will receive a restriction error when Level 3 data is requested.

**The SD-DDR-2024 form** (Smart Data — Data Distribution Request) is the formal mechanism to request CDF3 access. Mastercard requires authorisation from a designated Smart Data Administrator at the client organisation before enabling access. This is a data governance control — it prevents HSBC from accessing enriched transaction data without explicit client consent.

### 10.4 KYC/KYB Name Change Policy

HSBC's Know Your Customer (KYC) and Know Your Business (KYB) framework requires that cardholder identity records are accurate and verifiable at all times. For name changes, this means:

- Every name change must be supported by primary identity document evidence
- Where a cardholder's name has changed more than once, the full chain of name changes must be documented
- Documents must be verified (MRZ validation for passports, format validation for certificates)
- All documents must be logged to the cardholder record
- Changes must not be executed until the full chain is verified — a partial verification is not acceptable

---

## 11. Knowledge Base Entries — Learned Patterns

### 11.1 KB-FRAUD-LIMIT-HOLD-001

**Entry ID:** KB-FRAUD-LIMIT-HOLD-001
**Created:** 2026-03-09 10:23:09 GMT
**Source case:** CSC-2026-0309-CC-0291
**Confirmed by:** SM Sarah Okonkwo
**Classification:** Fraud Alert + Limit Request — Hold and Escalate Protocol

#### Pattern Definition (All Four Triggers Must Be Present)

1. Inbound PA limit amendment request received
2. Active fraud alert found on cardholder account (MiVision internal flag present)
3. Alert unactioned for more than 24 hours in Fraud Operations queue
4. Requested limit exceeds auto-approve ceiling for the cardholder's role

#### Recorded Decision — Option B Protocol (Auto-Execute on Next Occurrence)

1. Do not execute limit increase — hold pending fraud alert resolution
2. Notify Fraud Operations of queue gap — file internal notification, create CRM case linking the alert
3. Send holding response to PA — brief, neutral, no fraud disclosure (POCA compliance)
4. Prepare full SM priority escalation brief with all findings and recommended next steps
5. Notify SM that Pace has acted — reference KB-FRAUD-LIMIT-HOLD-001 as decision authority

#### Regulatory Flag

- **POCA 2002 Sections 333A–333E** apply from the moment SAS alert data is accessed
- All PA-facing communications while the alert is open must be reviewed for POCA compliance
- Holding response must reference only "additional review period" — no mention of fraud, suspicious activity, or investigation
- Option C (immediate decline with notification) is flagged as legally risky for this reason

#### Future Behaviour

On next detection of this four-trigger pattern, Pace will:
- Auto-execute Option B without invoking HITL
- Notify SM with reference to KB-FRAUD-LIMIT-HOLD-001 as decision authority
- SM will receive a summary notification, not a decision prompt

#### Review Trigger

This entry will be reviewed and potentially revised if:
- Three or more cases deviate from expected outcome after auto-execution
- Regulatory guidance on POCA tipping-off changes materially
- Annual knowledge base audit (scheduled: 2027-01)
---

## 12. SM Q&A Thread Library — Case 1

> **Codegen instruction:** Every Q&A pair below is a hard-coded response in the SM chat interface. Questions are shown in user format; answers are shown as the Pace SM Assistant response. Thread groupings indicate related follow-up questions that should be surfaced as suggestions after the primary answer is given.

---

### Thread 1.1 — Case Overview

**Q: What happened in the Aon case today?**

A: Pace resolved a three-request PA email from Rachel Griffiths at Aon plc (UK) — case CSC-2026-0309-AON-0847. Rachel's email (received 14:03:08 GMT) contained three requests on behalf of MD Sophia Chen (card ••••4421): investigate a card decline in Singapore, produce a Q1 2026 spend report for internal audit, and increase Sophia's credit limit for an APAC roadshow. Pace handled all three autonomously. Travel regions were activated, the limit was increased, a Smart Data access form was filed and approved, the spend report was generated, and a 3-part client response was drafted for your review. Total elapsed time was 18 minutes 04 seconds, of which 6 minutes 13 seconds was waiting for Smart Data access approval from Aon. No SM decisions were required. The case is complete — your only action is to review and send the draft response.

**Q: How long did the Aon case take?**

A: Total elapsed time was 18 minutes 04 seconds. Pace's own processing time was 11 minutes 51 seconds. The remaining 6 minutes 13 seconds was a wait for Smart Data access approval from Aon's Smart Data Administrator, P. Nair (p.nair@aon.com). This wait was not idle — Pace continued executing the MiVision changes (travel regions and limit increase) in parallel while waiting.

**Q: What did Pace do in the Aon case without asking me?**

A: Pace executed all substantive actions autonomously: verified Rachel Griffiths as the registered PA for AON-UK-CC-0047, retrieved and interpreted the decline code from the Auth Platform, loaded programme policy POL-AON-UK-2026, applied policy reasoning to approve all three travel regions and the limit increase, activated SGP/JPN/HKG in MiVision, increased Sophia's limit from GBP 25,000 to GBP 35,000, detected that Smart Data access was not configured, filed the Mastercard SD-DDR-2024 form autonomously, obtained approval from Aon, ran the Q1 spend query, generated the report, and drafted the full 3-part client response. All of this fell within Pace's authorised scope — no action required SM approval. The case is ready for your 2-minute review.

---

### Thread 1.2 — The Decline

**Q: Why was Sophia's card declined in Singapore?**

A: Sophia's card (••••4421) was declined at Marina Bay Sands Hotel & Resort in Singapore on 2026-03-08 at 19:47 SGT (11:47 GMT). The decline code was 57 — "Transaction Not Permitted To Cardholder" — which means a geographic spending restriction was active on the card. Singapore was not in Sophia's approved travel regions list in MiVision. This is a routine travel control issue, not a fraud block. The SAS fraud score at the time of the declined transaction was 22 out of 100 — well below the alert threshold of 75 — confirming there was no fraud concern associated with this transaction.

**Q: What was the decline code for Sophia's card?**

A: The decline code was 57. This code means "Transaction Not Permitted To Cardholder" and in the context of HSBC commercial cards, it almost always indicates an active geographic restriction. The card was not blocked, not reported lost or stolen, and had no fraud alerts. The decline was purely a travel controls issue — Singapore had not been added to Sophia's approved travel regions.

**Q: Was Sophia's card declined because of fraud?**

A: No. The decline had nothing to do with fraud. The SAS fraud score at the time of the declined transaction was 22 out of 100 — the alert threshold is 75. There were no fraud flags on the account, no suspicious transaction patterns, and no alerts in the Fraud Operations queue. The decline was caused solely by a geographic restriction (Code 57) — Singapore was not in Sophia's approved travel regions in MiVision.

**Q: How much was the declined transaction?**

A: The declined transaction at Marina Bay Sands Hotel & Resort in Singapore was GBP 1,840.00 (equivalent to approximately SGD 3,128.00 at the exchange rate applicable at the time). The merchant category code was 7011 — Hotels and Motels. The transaction was attempted at 19:47 Singapore time on 2026-03-08.

**Q: What did Pace do to fix the decline?**

A: Pace activated Singapore (SGP), Japan (JPN), and Hong Kong (HKG) as approved travel regions for Sophia's card in MiVision. All three are active from today (2026-03-09) until 2026-03-30, which aligns with the stated 3-week APAC roadshow. After this date, the regions will auto-revert to their previous settings. The activation reference is TRV-2026-0309-44211. Sophia can now use her card freely across all three destinations.

---

### Thread 1.3 — Travel Regions

**Q: Which travel regions did Pace activate for Sophia?**

A: Pace activated three travel regions for Sophia Chen's card (••••4421): Singapore (SGP), Japan (JPN), and Hong Kong (HKG). All three are active from 2026-03-09 and will auto-revert on 2026-03-30 — 21 days, aligned with the APAC roadshow window stated in Rachel's email. Reference: TRV-2026-0309-44211.

**Q: Why was Hong Kong approved if it's not in the OECD?**

A: Policy POL-AON-UK-2026 distinguishes between OECD and non-OECD countries for travel activation. OECD members (which include Singapore since 2024 and Japan) can be auto-approved on PA email confirmation alone. Hong Kong is not an OECD member, so it normally requires written PA authority. However, Rachel Griffiths's email explicitly mentioned travel to Hong Kong as part of the APAC roadshow — this constitutes written PA authority under the policy, since the registered PA made the request in writing. Pace applied this reasoning and auto-approved HKG on that basis. No additional sign-off was required.

**Q: When do the travel regions expire?**

A: The travel regions for Singapore, Japan, and Hong Kong on Sophia's card (••••4421) auto-revert on 2026-03-30. This date was set by Pace to align with the end of the 3-week APAC roadshow stated in Rachel's email (starting 2026-03-09, running for approximately 21 days). MiVision will automatically remove the regions and restore the previous settings on that date. No manual action is required.

**Q: Can Sophia use her card right now in Singapore?**

A: Yes. The Singapore travel restriction was removed as of 14:09:44 GMT today when Pace activated SGP in MiVision. Sophia can use her card immediately at any merchant in Singapore. The same applies for Japan and Hong Kong. All three regions are active until 2026-03-30.

---

### Thread 1.4 — Limit Increase

**Q: Was the limit increase for Sophia approved?**

A: Yes. Sophia's credit limit was increased from GBP 25,000 to GBP 35,000 (temporary) effective at 14:09:44 GMT today. This was auto-approved by Pace without requiring your sign-off. Sophia is a Managing Director, and programme policy POL-AON-UK-2026 sets the auto-approve ceiling for MDs at GBP 40,000 for temporary limits. GBP 35,000 is within this ceiling. Pace also ran a 7-point policy checklist and all criteria passed. The limit will auto-revert to GBP 25,000 on 2026-03-30. Reference: LIM-2026-0309-44212.

**Q: Did you need my sign-off for the limit increase?**

A: No. Sophia Chen is a Managing Director, and programme policy POL-AON-UK-2026 sets the auto-approve ceiling for Managing Directors at GBP 40,000 for temporary limits. The requested amount of GBP 35,000 is below this ceiling. Pace ran a 7-point checklist — no active fraud alerts, no overdue payments, MTD utilisation within acceptable range, consistent with stated purpose, programme-level facility has headroom — and all criteria passed. Your sign-off would only have been required if the request had exceeded GBP 40,000, or if any item on the checklist had failed.

**Q: What is Sophia's new limit?**

A: Sophia's current limit is GBP 35,000 (temporary). It was increased from GBP 25,000 at 14:09:44 GMT today and will auto-revert to GBP 25,000 on 2026-03-30. Reference: LIM-2026-0309-44212. Her MTD balance as of the case opening was GBP 9,840.20, giving her approximately GBP 25,159.80 of available credit at the new limit.

**Q: When does Sophia's limit go back to normal?**

A: Sophia's limit will automatically revert from GBP 35,000 to GBP 25,000 on 2026-03-30. This date was set by Pace to align with the end of her APAC roadshow. MiVision will handle the revert automatically — no action required from you or the PA.

---

### Thread 1.5 — Smart Data & Spend Report

**Q: Why did Pace have to file a form for the spend data?**

A: Aon's commercial card programme (AON-UK-CC-0047) did not have a CDF3 distribution configured in Mastercard Smart Data OnLine™. CDF3 is the mechanism that allows HSBC to access Level 3 enhanced transaction data for a programme. Without it, any Level 3 query returns an access restriction error. When Pace detected this restriction at 14:09:44 GMT, it immediately filed a Mastercard SD-DDR-2024 (Smart Data Data Distribution Request) form — reference SD-DDR-2026-0309-AON047 — authorisation email sent to smartdata.admin@aon.com with Rachel Griffiths copied. Approval came from P. Nair (Aon Global Smart Data Admin) at 14:22:31 GMT — 6 minutes 13 seconds later. Pace then ran the query and generated the report within 27 seconds of receiving approval.

**Q: What is in the spend report for Sophia?**

A: The Q1 2026 spend report for Sophia Chen (card ••••4421) covers the period 1 January 2026 to 31 March 2026 and contains 84 transactions totalling GBP 21,480.60. Level 3 enhanced data (including GL codes, cost centre codes, and merchant-level detail) is available on 73% of transactions (61 out of 84). The remaining 27% (23 transactions) have Level 2 data only (merchant name and amount). The report is structured in bank statement format: cover page with cardholder information, transaction detail pages, and a summary page with spend by category, top 5 merchants, and monthly breakdown. Report reference: SD-RPT-2026-Q1-AON047.

**Q: How much did Sophia spend in Q1?**

A: Sophia Chen spent GBP 21,480.60 across 84 transactions in Q1 2026 (1 January to 31 March 2026). The average transaction was GBP 255.72. The largest single transaction was GBP 1,200.00 at The Peninsula Hong Kong. The most frequent spending category was Hotels & Motels with 28 transactions.

**Q: Who approved the Smart Data access?**

A: P. Nair, the Aon Global Smart Data Administrator (p.nair@aon.com), approved the access request at 14:22:31 GMT. The approval email referenced SD-DDR-2026-0309-AON047. P. Nair has authority to approve CDF3 data distribution requests for Aon's Mastercard programmes. Rachel Griffiths was copied on both the request and the approval.

**Q: What is the reference for the spend report?**

A: The spend report reference is SD-RPT-2026-Q1-AON047. The underlying Smart Data access authorisation reference is SD-DDR-2026-0309-AON047.

---

### Thread 1.6 — SM Action

**Q: What do I need to do for the Aon case?**

A: Your only required action is to review the draft 3-part response to Rachel Griffiths (Artifact 12 in the case dashboard) and the Q1 spend report (Artifact 09). Once you are satisfied, send the email to rachel.griffiths@aon.com. The report is attached in the draft as Q1_2026_Sophia_Chen_SmartData formatted in bank statement PDF format. No investigation is required. Estimated time: under 2 minutes.

**Q: Has Rachel been updated yet?**

A: Not yet. The draft response has been prepared by Pace but has not been sent — it is awaiting your review. The draft is a 3-part email covering the decline resolution, the spend report attachment, and the limit increase confirmation. Once you send it, Rachel and Sophia will have everything they need.

**Q: Is the Aon case SLA compliant?**

A: Yes. The case was processed within the Priority SLA window for AON-UK-CC-0047. Total elapsed time was 18 minutes 04 seconds from receipt of Rachel's email to the draft response being ready for SM review. The Priority SLA for Aon allows up to 4 business hours for multi-request cases — this was resolved in under 20 minutes.

---

## 13. SM Q&A Thread Library — Case 2

### Thread 2.1 — Case Overview

**Q: What happened in the Clifford Chance case?**

A: Pace received a PA email from James Holroyd at Clifford Chance LLP (10:08:31 GMT) requesting a temporary limit increase from GBP 20,000 to GBP 45,000 for Richard Okafor (card ••••7732). Stated purpose: a Microsoft Azure cloud licensing invoice of approximately GBP 38,000. What appeared to be a routine limit request became an exception case when Pace discovered an active, unactioned fraud alert on the account — alert SAS-2026-0307-77321 — which had been sitting in the Fraud Operations queue for 48 hours without being actioned. Programme policy Section 6.1.4 prohibits any limit amendment while a fraud alert is active. Pace invoked HITL, you selected Option B (hold the limit, escalate the fraud alert, send a holding response to James), and Pace executed all three tracks simultaneously. Case reference: CSC-2026-0309-CC-0291.

**Q: Did Pace approve the limit increase for Richard Okafor?**

A: No. Pace identified two independent reasons why the limit increase could not proceed at this time. First: an active fraud alert (SAS-2026-0307-77321) is on the account — programme policy Section 6.1.4 is a hard block on all limit amendments while a fraud alert is active, regardless of the requested amount or stated purpose. Second: the requested amount of GBP 45,000 exceeds the auto-approve ceiling of GBP 35,000 for Richard Okafor's role (Head of Department), meaning SM sign-off would be required independently even if the fraud alert were resolved. Both issues must be addressed before the limit increase can proceed.

**Q: Why did Pace escalate this case to me?**

A: Pace invoked HITL (Human-in-the-Loop) for three reasons. First, the combination of an active fraud alert, a limit request above the auto-approve ceiling, an MCC mismatch between the stated purchase purpose and the flagged transactions, and a 48-hour process gap was a novel pattern not previously seen. Second, drafting any communication to James Holroyd while an active fraud alert is being reviewed carries POCA 2002 tipping-off risk — a decision with legal implications. Third, the holding response required careful drafting to avoid inadvertent disclosure of the investigation. These factors together met Pace's threshold for human judgment. You resolved the HITL in 8 seconds.

---

### Thread 2.2 — The Fraud Alert

**Q: What is alert SAS-2026-0307-77321?**

A: SAS-2026-0307-77321 is an active fraud alert on Richard Okafor's card (••••7732). It was raised by the SAS Fraud Management system on 2026-03-07 at 23:14 GMT — immediately after the third in a series of suspicious transactions. The alert score is 74 out of 100. The auto-block threshold is 85, so the card was not automatically suspended. As of 10:14 GMT today, the alert had been in the Fraud Operations queue for 48 hours without being assigned, actioned, or escalated. No CRM case had been created, and you had not been notified.

**Q: What triggered the fraud alert on Richard's card?**

A: Three triggers activated alert SAS-2026-0307-77321. First: new merchant category — Richard's card had no MCC 5065 (Electrical Parts & Equipment) transactions in the previous 18 months. Three such transactions appeared within 6 days. Second: off-hours timing — all three transactions occurred between 19:00 and 22:00 GMT. Analysis of Richard's 18-month transaction history shows 99% of his activity occurs between 07:00 and 19:00 GMT. Third: high MTD velocity — his MTD spend of GBP 17,840 is 117% above his 18-month average of GBP 8,200.

**Q: What are the suspicious transactions on Richard's card?**

A: Three transactions were retrieved from the Auth Platform, all in MCC 5065 (Electrical Parts & Equipment): (1) 2026-03-02, 19:22 GMT — TECHPOINT SUPPLIES LTD, London EC2 — GBP 2,840.00 — SAS score 61/100; (2) 2026-03-05, 20:41 GMT — TECHPOINT SUPPLIES LTD, London EC2 — GBP 3,120.00 — SAS score 69/100; (3) 2026-03-07, 21:08 GMT — SIGMA ELECTRONICS TRADE, London E1 — GBP 2,940.00 — SAS score 74/100 (alert raised). Total: GBP 8,900.00 across three transactions. Note that the alert was raised on the third transaction when the cumulative pattern caused the score to reach 74.

**Q: Why does the MCC matter in this case?**

A: The MCC mismatch is significant. James Holroyd's email says the limit increase is for a Microsoft Azure cloud licensing invoice — that would be MCC 7372 (Computer Programming and Data Processing). The three flagged transactions are all MCC 5065 — Electrical Parts & Equipment. These are completely different merchant categories. A company buying cloud software licences from Microsoft would not generate transactions at electronics parts suppliers. This inconsistency doesn't prove fraud, but it raises the question of whether the Microsoft Azure story and the electronics transactions are related — or whether the card is being used by someone other than Richard for electronics purchases.

**Q: How long had the fraud alert been open when Pace found it?**

A: Alert SAS-2026-0307-77321 had been open for exactly 48 hours when Pace retrieved it at 10:14:19 GMT on 2026-03-09. The alert was raised on 2026-03-07 at 23:14 GMT. It was sitting in the Fraud Operations queue unassigned — no analyst had picked it up, no CRM case had been created, and you (Sarah Okonkwo) had not been notified. This is an internal process gap.

**Q: Is Richard's card currently blocked?**

A: No. Richard's card (••••7732) is currently active. The SAS score of 74/100 is below the auto-block threshold of 85/100, so no automatic suspension was triggered. However, the card's available credit is only GBP 2,160.00 (89.2% of the GBP 20,000 limit is already utilised as MTD balance of GBP 17,840). The requested limit increase has been held pending fraud alert resolution, so the card remains at GBP 20,000.

**Q: Should Richard's card be blocked?**

A: That decision rests with Fraud Operations once they review alert SAS-2026-0307-77321. Pace does not have the authority to block a card unilaterally — that is an irreversible action requiring explicit SM confirmation. The current position is: card active, limit held at GBP 20,000, fraud alert escalated to Fraud Operations, holding response sent to PA. If Fraud Operations determines a block is warranted, they will advise you and you can execute the block through MiVision with Pace support.

---

### Thread 2.3 — The FDAR

**Q: What is a FDAR and why did Pace need one?**

A: FDAR stands for Fraud Data Access Request. SAS Fraud Management alert records are classified as controlled data under HSBC Internal Fraud Investigation Policy IFI-POL-2023. This means any system or person seeking to read those records must obtain explicit approval from the Fraud Operations Duty Manager before access is granted. When Pace detected the internal flag on Richard's MiVision record, it knew a SAS query would be required — and it knew a FDAR was needed to execute that query. Pace filed the FDAR (ticket FDAR-2026-0309-0441) at 10:08:58 GMT, immediately after detecting the flag, and ran a parallel Auth Platform query while waiting. The FDAR was approved by T. Osei (Fraud Ops Duty Manager) at 10:14:19 GMT — 5 minutes 21 seconds later.

**Q: Who approved the FDAR?**

A: T. Osei, HSBC Fraud Operations Duty Manager (t.osei@hsbc.com, internal extension x4892), approved FDAR-2026-0309-0441 at 10:14:19 GMT. The approval granted read-only access to SAS records for card ••••7732 for a 4-hour window. T. Osei's response also noted that the alert was already in the queue and that Pace's notification had expedited their review of it.

**Q: How long did the FDAR take?**

A: The FDAR was filed at 10:08:58 GMT and approved at 10:14:19 GMT — a total of 5 minutes 21 seconds. During this wait, Pace was not idle: it queried the Auth Platform in parallel and retrieved the three suspicious MCC 5065 transactions, building the risk picture before SAS access was even granted.

---

### Thread 2.4 — The HITL Decision

**Q: What were the three options I was given?**

A: When Pace presented the HITL prompt at 10:22:03 GMT, you were given three options. Option A: Stand down — full manual handoff to you with all Pace findings handed over. Pace assessed this as inefficient since the investigation was already complete. Option B (recommended): Hold the limit increase, escalate the fraud alert to Fraud Operations, send a neutral holding response to James Holroyd — no fraud disclosure, POCA compliant. Pace assessed this as operationally proportionate and legally correct. Option C: Decline the limit request and notify James immediately. Pace flagged this as legally risky — declining and citing a review reason that James could connect to the recent transactions could constitute POCA tipping-off. You selected Option B at 10:22:41 GMT.

**Q: Why did Pace recommend Option B?**

A: Option B was recommended because it is the only option that simultaneously: (1) complies with Section 6.1.4 by holding the limit; (2) addresses the 48-hour process gap by notifying Fraud Operations; (3) keeps James Holroyd informed without disclosing the fraud investigation (POCA compliance); (4) preserves the ability to progress the limit request once the fraud alert is resolved; and (5) gives you, as SM, a clear and manageable set of next steps. Option A was inefficient. Option C risked a POCA tipping-off breach.

**Q: How quickly did I make the decision?**

A: You selected Option B at 10:22:41 GMT — 8 seconds after the HITL prompt was presented at 10:22:03 GMT.

**Q: What did Pace do after I selected Option B?**

A: Immediately after your selection, Pace executed three parallel actions. First: it sent an internal notification to Fraud Operations (fraudops.dutymanager@hsbc.com) flagging the 48-hour queue gap on alert SAS-2026-0307-77321 and linking CRM case CSC-2026-0309-CC-0291. Second: it drafted the neutral holding response to James Holroyd (Artifact 14) — ready for your approval before sending. Third: it prepared the full SM priority escalation brief for you (Artifact 15) with all findings, a 4-step action checklist, and POCA compliance guidance. Simultaneously, it wrote knowledge base entry KB-FRAUD-LIMIT-HOLD-001 so this pattern can be handled automatically in future.

---

### Thread 2.5 — POCA & Compliance

**Q: What is POCA and why does it matter here?**

A: POCA stands for the Proceeds of Crime Act 2002. Sections 333A to 333E of POCA create criminal tipping-off offences. In simple terms, once HSBC becomes aware of suspicious activity related to a customer account — such as accessing an active fraud alert — it is prohibited from disclosing that fact to the customer or anyone connected to them in a way that could prejudice any investigation. In the Clifford Chance case, the moment Pace accessed alert SAS-2026-0307-77321 under FDAR-2026-0309-0441, POCA tipping-off provisions applied. Any communication to James Holroyd or Richard Okafor that mentioned the fraud alert, the suspicious transactions, or the reason why the limit increase was being held for fraud-related reasons — could constitute a criminal offence. This is why the holding response (Artifact 14) says only "a short additional review period is required" — nothing more.

**Q: Is the holding response POCA compliant?**

A: Yes, the holding response drafted by Pace (Artifact 14) has been deliberately crafted to be POCA compliant. It references only "a short additional review period" and gives no indication of the reason for the delay. It does not mention fraud, suspicious transactions, the SAS alert, or the FDAR. It does not give James any basis to infer that his client's card is under fraud investigation. The response must be reviewed by you before sending to confirm it remains POCA compliant — if you add any explanation of the reason for the delay that relates to the transactions or the alert, please consult the legal team before sending.

**Q: When can I tell James what's really going on?**

A: Once Fraud Operations has reviewed, actioned, and formally closed or cleared alert SAS-2026-0307-77321, POCA tipping-off provisions no longer apply in the same way. At that point, you can communicate more openly with James — either telling him the alert has been cleared and the limit request can be progressed, or, if fraud is confirmed, involving the legal team to determine what can be disclosed and how. The key point is: do not disclose the investigation while the alert is open and under active review.

---

### Thread 2.6 — Next Steps

**Q: What do I need to do next in the Clifford Chance case?**

A: You have four actions. First: approve the holding response to James Holroyd (Artifact 14) and send it — review it carefully for POCA compliance before sending. Second: coordinate with Fraud Operations to confirm they have picked up alert SAS-2026-0307-77321 — T. Osei acknowledged the queue gap but you should follow up to confirm assignment. Third: once Fraud Operations has reviewed the alert, obtain their finding (cleared / confirmed fraud / escalated). Fourth: based on the Fraud Operations outcome, decide whether to progress the GBP 45,000 limit request — if cleared, proceed with your sign-off as SM; if fraud confirmed, advise James through appropriate channels with legal guidance.

**Q: What happens if Fraud Operations clears the alert?**

A: If Fraud Operations reviews alert SAS-2026-0307-77321 and determines the transactions are legitimate (e.g., Richard verifies them), the alert will be closed. Once closed, Section 6.1.4 no longer applies. You can then progress the limit increase. However, you would still need to provide SM sign-off since GBP 45,000 exceeds Richard's auto-approve ceiling of GBP 35,000. You may also want to ask James for more context on the MCC mismatch — why does a Microsoft Azure purchase show up as electronics transactions? That inconsistency is worth understanding even if the alert is cleared.

**Q: What happens if fraud is confirmed?**

A: If Fraud Operations confirms the transactions are fraudulent, a different workflow begins — which is outside the scope of Pace's current authority. Generally: the card would be suspended, a formal fraud report would be filed, and HSBC's Fraud Investigation team would lead. The limit request would be declined — but the communication to James at that point would be handled with legal team guidance to ensure full POCA compliance. Pace would support you with drafting and case documentation.

**Q: Will Pace handle this same situation automatically next time?**

A: Yes. Pace wrote knowledge base entry KB-FRAUD-LIMIT-HOLD-001 at 10:23:09 GMT. This entry captures the four-trigger pattern (limit request + active fraud alert + unactioned 24+ hours + above auto-approve ceiling) and records Option B as the confirmed response. Next time this exact combination is detected, Pace will auto-execute Option B without invoking HITL — notifying you that it has acted and citing KB-FRAUD-LIMIT-HOLD-001 as the decision authority. Your involvement will shift from "make a decision" to "review a notification."

---

## 14. SM Q&A Thread Library — Case 3

### Thread 3.1 — Case Overview

**Q: What happened in the Herbert Smith Freehills case?**

A: Pace received a name change request from Priya Nair (PA, Herbert Smith Freehills LLP) for cardholder Eleanor Whitfield-Osei (card ••••2847). Eleanor recently married and her new legal name is Eleanor Sutherland. Priya attached the marriage certificate (KCC-2026-02-14-00471). Pace ingested the certificate and immediately detected a discrepancy: the certificate listed Eleanor's pre-marriage name as "Eleanor Jane Whitfield", but her current card record shows "Eleanor Whitfield-Osei" — a hyphenated name not explained by the certificate. Pace requested an additional document (Eleanor's passport), received it, ingested and MRZ-validated it, constructed a 3-link identity chain, confirmed all links, then executed the name change in MiVision and initiated a replacement card. Case reference: CSC-2026-0309-HSF-0314. Total elapsed: 31 minutes 22 seconds (of which 19 minutes was waiting for Priya to supply the passport).

**Q: Was the name change completed?**

A: Yes. The name change was executed in MiVision at 15:02:14 GMT. Eleanor's name has been updated to Eleanor Jane Sutherland across all fields: surname, full legal name, and embossed name on the card (E SUTHERLAND). Her passport (No. 523847610) has been logged to the cardholder record. A replacement card has been initiated (CRD-2026-0309-28471). The old card (••••2847) remains active until the new card is activated — no service interruption. A confirmation email has been drafted for your approval. One item is outstanding: the delivery address for the replacement card.

**Q: What was the identity chain for Eleanor?**

A: Eleanor's identity chain has three names across two links, validated by two documents. Link 1: Eleanor Jane Whitfield → Eleanor Jane Whitfield-Osei, evidenced by her UK Passport (No. 523847610, issued by HM Passport Office on 2025-03-18), which shows the Whitfield-Osei name with full MRZ validation. Link 2: Eleanor Jane Whitfield-Osei → Eleanor Jane Sutherland, evidenced by her marriage certificate (KCC-2026-02-14-00471, Kensington & Chelsea, 14 February 2026). Both links are validated. The chain is complete.

---

### Thread 3.2 — The Discrepancy

**Q: Why couldn't Pace just change the name immediately?**

A: Because the marriage certificate did not match the name in the system. The certificate listed Eleanor's pre-marriage name as "Eleanor Jane Whitfield." Her card record (in MiVision) shows "Eleanor Whitfield-Osei" — a hyphenated name with an "-Osei" element that is not present in the certificate's pre-marriage field. These are different names. If Pace had simply executed the name change from Whitfield-Osei to Sutherland using only the marriage certificate, the audit trail would show: Whitfield-Osei on 9 March → Sutherland on 9 March, supported by a certificate that says Whitfield → Sutherland. The intermediate step (Whitfield → Whitfield-Osei) would be undocumented — an incomplete identity chain and a KYC compliance breach. Policy POL-HSF-UK-2026 Section 4.3.1 requires the full chain to be established before any change is executed.

**Q: What exactly was the discrepancy Pace found?**

A: The field-by-field comparison was: Marriage certificate bride name (before marriage) = "Eleanor Jane Whitfield." MiVision card record current name = "Eleanor Whitfield-Osei." The difference is the "-Osei" element. "Whitfield" and "Whitfield-Osei" are not the same name. A prior name change — most likely from an earlier marriage — resulted in Eleanor adopting the Whitfield-Osei name, but this was not reflected in the marriage certificate's pre-marriage name field (which simply shows the birth surname). Pace detected this on a field-by-field comparison at 14:32:01 GMT.

**Q: What document did Pace request to fix the discrepancy?**

A: Pace drafted a document request (approved by you, David Mensah, at 14:39:22 GMT) asking Priya for one of two documents: (1) Eleanor's current passport showing the name Eleanor Whitfield-Osei, or (2) a deed poll or statutory declaration from the prior name change (Whitfield → Whitfield-Osei). The document request explained precisely why the gap existed — naming the specific names that didn't match and specifying exactly what document would close it. Priya replied at 14:58:26 GMT with Eleanor's passport.

---

### Thread 3.3 — The Passport

**Q: What was in Eleanor's passport?**

A: Eleanor's UK passport (No. 523847610) was issued by HM Passport Office on 2025-03-18 and expires 2035-03-17. It records: Surname: WHITFIELD-OSEI; Given names: ELEANOR JANE; Nationality: British Citizen; Date of birth: 14 MAR 1994; Sex: F; Place of birth: LONDON, UNITED KINGDOM. The passport was renewed in 2025, meaning it reflects Eleanor's current legal name at the time of renewal — confirming the Whitfield-Osei name was her legal name as of March 2025.

**Q: How did Pace validate the passport?**

A: Pace performed a full MRZ (Machine Readable Zone) validation on the passport. The MRZ contains two 44-character lines encoded with the passport data in a standardised ICAO TD3 format. Pace validated four checksum elements: the document number check digit, the date of birth check digit, the date of expiry check digit, and the composite check digit covering all mandatory fields. All four checks passed. This confirmed the document has not been tampered with and the biographical data is internally consistent. MRZ validation is more thorough than a visual inspection — it catches alterations that might not be obvious to the naked eye.

**Q: What is the MRZ on Eleanor's passport?**

A: The MRZ on Eleanor's passport consists of two lines. Line 1: P<GBRWHITFIELD-OSEI<<ELEANOR<JANE<<<<<<<<<<<<. Line 2: 5238476109GBR9403146F3503172<<<<<<<<<<<<<<<<<<6. These decode to: document type P (passport), issuing country GBR (United Kingdom), surname WHITFIELD-OSEI, given names ELEANOR JANE, passport number 523847610, nationality GBR, date of birth 940314 (14 March 1994), sex F, expiry date 350317 (17 March 2035). All checksum digits validated by Pace.

**Q: Why did the passport validate the Whitfield to Whitfield-Osei link?**

A: The passport was issued in 2025 and shows Eleanor's name as Whitfield-Osei. The marriage certificate establishes her name was Whitfield at birth. The PA's email confirmed Eleanor had a prior marriage that resulted in the hyphenated name. The passport — being a primary government-issued identity document issued after the prior name change — is the authoritative evidence that Eleanor's legal name was Whitfield-Osei as of 18 March 2025. This is sufficient to bridge the gap: Whitfield (birth) → Whitfield-Osei (prior marriage, documented by passport as current name on renewal). Together with the marriage certificate (Whitfield-Osei → Sutherland), the chain is complete.

---

### Thread 3.4 — The Name Change Execution

**Q: What exactly changed in MiVision for Eleanor?**

A: Four fields were updated in MiVision at 15:02:14 GMT: (1) Surname changed from Whitfield-Osei to Sutherland. (2) Full legal name changed from Eleanor Jane Whitfield-Osei to Eleanor Jane Sutherland. (3) Embossed name on card changed from E WHITFIELD-OSEI to E SUTHERLAND. (4) Identity document logged: UK Passport 523847610 (issuing authority HM Passport Office, expiry 2035-03-17). A name change history entry was also created in MiVision referencing both the passport and the marriage certificate with their dates and reference numbers.

**Q: Is Eleanor's old card still working?**

A: Yes. The old card (••••2847, embossed E WHITFIELD-OSEI) remains fully active and can be used immediately. It will remain active until Eleanor activates her new card (which will be embossed E SUTHERLAND, replacement reference CRD-2026-0309-28471). There is no interruption to her card service during the transition.

**Q: When will Eleanor get her new card?**

A: The replacement card (reference CRD-2026-0309-28471) has been initiated but cannot be dispatched until the delivery address is confirmed. The confirmation email to Priya Nair (Artifact 15) asks for this. Once the delivery address is provided, the expected lead time is 5 to 7 business days. You should update the replacement card request in MiVision once Priya confirms the address.

**Q: What is the replacement card reference?**

A: The replacement card reference is CRD-2026-0309-28471.

---

### Thread 3.5 — SM Actions

**Q: What do I need to do for the HSF case?**

A: You have two actions. First: approve and send the confirmation email to Priya Nair (Artifact 15). The email confirms the name change, describes the replacement card status, and asks Priya to provide the delivery address. Second: once Priya provides the delivery address, update the replacement card request CRD-2026-0309-28471 in MiVision and confirm the 5–7 business day lead time to Priya.

**Q: Why do I need to approve the confirmation email?**

A: All client-facing communications from Pace are routed through SM approval before sending. This is a design principle — Pace drafts, the SM confirms and sends. In this case, the confirmation email summarises a significant account change (name update) and initiates a physical card replacement. Your review ensures accuracy before the client receives it.

---

## 15. SM Q&A Thread Library — Cross-Case & Platform Questions

### Thread 5.1 — Pace Capabilities

**Q: What can Pace do?**

A: Pace operates through seven core primitives: Reading (parsing emails and verifying PA identity), Reasoning (applying policy and making decisions), Browser Agent (operating MiVision and other web systems autonomously), Navigation (querying system APIs — Auth Platform, SAS, CRM, Smart Data), Drafting (writing all client and internal communications), Document Ingestion (reading and extracting data from PDFs including passports and certificates), and Human-in-the-Loop (presenting structured decisions to SMs when human judgment is required). Across all three of today's cases, Pace handled 43 distinct actions across 8 systems in under 32 minutes total.

**Q: When does Pace ask for my help?**

A: Pace invokes HITL in six situations: (1) Novel pattern — a situation that has no existing knowledge base entry, (2) Regulatory sensitivity — POCA, sanctions, GDPR exposure, (3) Competing policy rules pointing in different directions, (4) Above the auto-approve financial ceiling, (5) Active compliance flag on the account, (6) Irreversible action risk — card cancellation, account suspension. In today's three cases, Pace invoked HITL twice: once in Case 2 when it detected the fraud alert and POCA tipping-off risk, and once in Case 3 to get your approval on the document request to Priya. You resolved both in under 10 seconds each.

**Q: What does Pace never do?**

A: Pace will never: make decisions on fraud investigations (it detects, reports, and escalates — never investigates), communicate directly with cardholders (all client communication goes through the SM), disclose active fraud investigation details to PAs or cardholders (POCA compliance), execute irreversible actions without explicit SM confirmation, modify its own knowledge base entries once written, or exceed its authorised data access scope.

**Q: How does Pace learn?**

A: Pace learns through its Self-Learning mechanism. When Pace encounters a novel situation and invokes HITL, and the SM makes a decision, Pace writes a Knowledge Base Entry (KBE) capturing the pattern, the options, the SM's selection, and the future behaviour to adopt. The next time this exact pattern is detected, Pace auto-executes the recorded option without HITL. Today's Case 2 produced KB-FRAUD-LIMIT-HOLD-001 — the fraud alert plus limit request pattern. Next time that pattern appears, Pace will handle it automatically and simply notify you that it has acted.

**Q: How does Pace handle situations it hasn't seen before?**

A: When Pace encounters a genuinely novel situation — one with no matching knowledge base entry — it does not guess. It performs a full investigation using all available data, constructs a risk assessment, identifies the available options, assigns a recommendation, and presents the HITL prompt to the SM with full context. The SM's decision then becomes the new knowledge base entry for future cases. This is exactly what happened in Case 2 today.

---

### Thread 5.2 — Systems Questions

**Q: What systems does Pace connect to?**

A: Pace connects to five HSBC and third-party systems: (1) HSBC CRM System — PA verification, programme data, case logging; (2) MiVision — cardholder profile management, limit changes, travel regions, name changes, card replacement; (3) HSBC Authorisation Platform — decline code lookup, transaction history; (4) SAS Fraud Management — fraud alert retrieval (requires FDAR approval); (5) Mastercard Smart Data OnLine™ — Level 2/3 enhanced transaction data (requires CDF3 distribution per programme). Pace also connects to the HSBC Internal Request System to file FDARs and other internal requests.

**Q: What is MiVision?**

A: MiVision is HSBC's commercial card management portal. It is the system of record for cardholder profiles, spending limits, travel regions, card status, and identity details. Pace uses its Browser Agent primitive to interact with MiVision — operating it autonomously as a user would, navigating screens, filling fields, and confirming changes. MiVision stores the programme policy links and flags from SAS Fraud Management, but it does not show the full alert detail — that requires a direct SAS query with FDAR approval.

**Q: What is Smart Data OnLine?**

A: Mastercard Smart Data OnLine™ is an enhanced transaction data platform that provides Level 2 and Level 3 data for commercial card programmes. Level 3 data includes line-item purchase detail, GL codes, commodity codes, merchant tax IDs, and quantity/unit price breakdowns — far richer than standard transaction records. For programmes without a CDF3 distribution configured (like Aon in today's Case 1), Pace must file an SD-DDR-2024 form and obtain client authorisation before accessing the data.

**Q: What is SAS Fraud Management?**

A: SAS Fraud Management is HSBC's real-time fraud detection system. It scores every transaction at the time of authorisation — scores range from 0 (clean) to 100 (highest risk). A score above 75 raises an alert in the Fraud Operations queue; a score above 85 auto-blocks the card. SAS records are classified as controlled data under IFI-POL-2023, meaning a Fraud Data Access Request (FDAR) is required before Pace or any system can read the alert records.

---

### Thread 5.3 — Policy Questions

**Q: What is the auto-approve ceiling for temporary limits?**

A: The auto-approve ceiling varies by client programme and by the cardholder's role. For Aon plc (POL-AON-UK-2026): Managing Directors have a ceiling of GBP 40,000. For Clifford Chance LLP (POL-CC-UK-2026): Heads of Department have a ceiling of GBP 35,000. Any temporary limit request above the role-specific ceiling requires SM sign-off. Any request above GBP 60,000 requires Credit Committee approval. Note that these ceilings apply only when no other blocking conditions exist — an active fraud alert (Section 6.1.4 for Clifford Chance) imposes a hard block regardless of the ceiling.

**Q: What is Section 6.1.4?**

A: Section 6.1.4 of policy POL-CC-UK-2026 (Clifford Chance LLP programme policy) states that no limit amendment — temporary or permanent, increase or decrease — may be processed on any account with an active, unresolved fraud alert. This block applies regardless of the requested amount, the cardholder's role, the stated purpose, or any other factor. It can only be lifted when Fraud Operations formally closes or clears the alert. This is the rule that prevented Pace from processing Richard Okafor's limit increase in Case 2.

**Q: What is the OECD rule for travel regions?**

A: Policy POL-AON-UK-2026 (and most HSBC commercial card programme policies) classify travel region requests as either OECD or non-OECD. For OECD member countries, PA email confirmation of travel is sufficient authority for Pace to activate the travel region without requiring a formal written authority letter. For non-OECD countries, written PA authority is required — but a PA's email explicitly requesting travel activation to that country qualifies as written authority. This is why Pace auto-approved Hong Kong (non-OECD) in Case 1: Rachel's email specifically named Hong Kong as a destination.

---

### Thread 5.4 — Audit & Compliance Questions

**Q: Where is the audit trail for all of today's cases?**

A: Every action Pace took in all three cases is logged in the CRM case records: CSC-2026-0309-AON-0847 (Case 1), CSC-2026-0309-CC-0291 (Case 2), and CSC-2026-0309-HSF-0314 (Case 3). Each log includes: the exact GMT timestamp of every action, the system accessed or acted upon, the reference numbers of every change applied or form filed, the SM name and timestamp for every HITL decision, and the knowledge base entries written. The logs are accessible in the case dashboard and satisfy HSBC's internal compliance requirements for operational record-keeping.

**Q: How do I know Pace didn't make a mistake in any of today's cases?**

A: Every decision Pace made is traceable to a specific policy rule, system record, or regulatory provision. In Case 1: the travel approvals trace to POL-AON-UK-2026 Sections 4.2 and 4.3.1 (OECD rule and written PA authority rule); the limit approval traces to the 7-point checklist and the MD auto-approve ceiling. In Case 2: the hold decision traces to Section 6.1.4 (fraud alert hard block) and to SAS alert SAS-2026-0307-77321; the HITL invocation traces to the POCA tipping-off risk. In Case 3: the pause and document request traces to the field-by-field name discrepancy and POL-HSF-UK-2026 Section 4.3.1; the chain validation traces to the passport MRZ checks. You can audit any of these decisions by reviewing the relevant artifact in the case dashboard.

**Q: Is Pace's document handling GDPR compliant?**

A: Yes. Pace processes identity documents (passports, marriage certificates) solely for the purpose of verifying cardholder identity in connection with an authorised account change request. The document data is extracted, used to validate the identity chain, and the key fields (document number, expiry, issuing authority) are logged to the cardholder record in MiVision — which is HSBC's existing system of record for KYC data. Pace does not store document images beyond the case record. All processing is within HSBC's existing data controller framework.

---

## 16. SM Decision Trees

### 16.1 Limit Amendment Request — Decision Tree

```
LIMIT AMENDMENT REQUEST RECEIVED
│
├─ Is there an active fraud alert on the account? (MiVision flag)
│   ├─ YES → HARD BLOCK (Section 6.1.4 or equivalent)
│   │         File FDAR, retrieve alert, notify Fraud Ops
│   │         Send holding response (POCA compliant)
│   │         Hold limit until alert cleared
│   │         → HITL if novel pattern
│   │
│   └─ NO → Continue →
│
├─ Is the requested amount within the auto-approve ceiling for the cardholder's role?
│   ├─ YES (and 7-point checklist passes) → AUTO-APPROVE
│   │         Execute in MiVision, set auto-revert, draft response
│   │
│   └─ NO (above ceiling, up to GBP 60,000) → SM SIGN-OFF REQUIRED
│             Prepare investigation summary, present to SM
│             SM approves → Execute in MiVision
│
└─ Is the requested amount above GBP 60,000 (temporary)?
    └─ YES → CREDIT COMMITTEE REQUIRED
              Prepare submission, route to Credit Committee
```

### 16.2 Travel Region Activation — Decision Tree

```
TRAVEL ACTIVATION REQUEST RECEIVED
│
├─ Is destination an OECD member country?
│   ├─ YES → Auto-approve. PA email confirmation sufficient.
│   │         Activate in MiVision. Set end date.
│   │
│   └─ NO (non-OECD) → Written PA authority required.
│       ├─ Is there explicit mention of this destination in the PA's email?
│       │   ├─ YES → Qualifies as written PA authority → Auto-approve
│       │   └─ NO → Request written PA authority → Wait → Activate on receipt
│
└─ Check: Any fraud flags or account restrictions?
    ├─ YES → Do not activate. Escalate to SM.
    └─ NO → Proceed with activation.
```

### 16.3 Name Change — Decision Tree

```
NAME CHANGE REQUEST RECEIVED
│
├─ STEP 1: Ingest document first (before MiVision lookup)
│
├─ STEP 2: Extract legal name from document
│
├─ STEP 3: Retrieve current MiVision name
│
├─ STEP 4: Field-by-field comparison
│   ├─ Names match → No gap → Continue →
│   └─ Names do not match → CHAIN INCOMPLETE
│       Request bridging document → Wait → Re-ingest →
│       Re-check chain → Loop until complete
│
├─ STEP 5: MRZ validation (if passport supplied)
│   ├─ PASS → Continue
│   └─ FAIL → Do not proceed. Flag document as potentially invalid. Escalate to SM.
│
├─ STEP 6: DOB cross-check (document vs MiVision)
│   ├─ MATCH → Same individual confirmed. Continue.
│   └─ MISMATCH → Identity cannot be confirmed. Escalate to SM.
│
├─ STEP 7: CRM clearance check
│   ├─ No flags → Continue
│   └─ Active flag → Escalate to SM before proceeding
│
└─ STEP 8: Execute name change in MiVision
    Log both documents. Initiate replacement card. Draft confirmation.
```

### 16.4 Fraud Alert Detected — Decision Tree

```
FRAUD ALERT FLAG DETECTED (MiVision or SAS)
│
├─ File FDAR immediately (parallel to other tasks)
│
├─ Retrieve alert details on FDAR approval
│
├─ Check: SAS score
│   ├─ > 85 → Card auto-blocked. Notify SM immediately.
│   └─ 50–84 → Card active. Alert in queue. Continue investigation.
│
├─ Check: Time in queue
│   ├─ < 24 hours → Normal queue. Flag for Fraud Ops attention.
│   └─ > 24 hours → PROCESS GAP. Urgent escalation to Fraud Ops required.
│
├─ Check: CRM case exists for alert?
│   ├─ YES → Check status. Update if needed.
│   └─ NO → Create CRM case. Link alert. Notify SM.
│
├─ Check: Any pending client requests that must be blocked?
│   ├─ YES (e.g., limit increase) → Apply relevant policy block.
│   │         Draft holding response (POCA compliant).
│   │         → HITL if novel combination
│   └─ NO → Log alert status. Monitor.
│
└─ Write KB entry if pattern is novel and SM decision has been made.
```

---

## 17. Glossary

| Term | Definition |
|---|---|
| **Auth Platform** | HSBC Authorisation Platform — records every card authorisation event including declines |
| **Auto-approve ceiling** | The maximum limit amount that Pace can approve without SM sign-off, determined by cardholder role and programme policy |
| **Browser Agent** | Pace primitive that autonomously operates web browsers to interact with MiVision and other web systems |
| **CDF3 Distribution** | Mastercard Card Data Feed 3 — the configuration required for a programme to receive Level 3 enhanced transaction data from Smart Data OnLine™ |
| **CRM** | Customer Relationship Management system — holds all PA records, programme details, and case histories |
| **FDAR** | Fraud Data Access Request — the internal approval required before accessing SAS Fraud Management records |
| **GRO** | General Register Office — the UK authority that issues marriage certificates, birth certificates, and death certificates |
| **HITL** | Human-in-the-Loop — the Pace mechanism for escalating decisions to an SM when human judgment is required |
| **IFI-POL-2023** | HSBC Internal Fraud Investigation Policy — classifies SAS data as controlled data requiring FDAR access |
| **KB Entry / KBE** | Knowledge Base Entry — a record written by Pace after a novel HITL decision, capturing the pattern and future behaviour |
| **Level 2 data** | Enhanced transaction data including merchant address, tax amount, and customer reference |
| **Level 3 data** | Full line-item transaction data including GL codes, commodity codes, unit prices, and quantities — requires CDF3 distribution |
| **MCC** | Merchant Category Code — a 4-digit code assigned to every merchant by Mastercard that describes the type of business |
| **MiVision** | HSBC's commercial card management portal — system of record for cardholder details, limits, and travel settings |
| **MRZ** | Machine Readable Zone — the two-line encoded section at the bottom of a passport data page, validated by Pace using ICAO TD3 checksum algorithms |
| **PA** | Programme Administrator — the client-side contact responsible for managing a commercial card programme |
| **POCA** | Proceeds of Crime Act 2002 — UK legislation that includes criminal tipping-off offences (Sections 333A–333E) |
| **Priority SLA** | The highest service level agreement tier for HSBC commercial card programmes (applies to Aon and Clifford Chance) |
| **SAS** | SAS Fraud Management — HSBC's real-time transaction fraud scoring and alert system |
| **SD-DDR-2024** | Mastercard Smart Data — Data Distribution Request form (2024 version) — used to request CDF3 access for a programme |
| **SM** | Service Manager — the HSBC Commercial Cards relationship manager assigned to a programme |
| **Smart Data OnLine™** | Mastercard's enhanced transaction data platform providing Level 2 and Level 3 data |
| **Standard SLA** | The standard service level agreement tier (applies to Herbert Smith Freehills) |
| **Tipping-off** | The criminal offence under POCA 2002 of disclosing to a subject or third party that a fraud investigation is underway |
| **Travel region** | A country or region that has been activated in MiVision to permit card transactions in that geography |
| **TD3** | ICAO travel document standard for passports — defines the MRZ format and checksum algorithms |

---

*End of Knowledge Base — Version 1.0 — 2026-03-09*
*Prepared by Zamp (Varni Labs Pte. Ltd.) for HSBC Commercial Cards — Pace SM Assistant*
*This document is confidential and intended for demo and development purposes only*
