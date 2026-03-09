# Task: Build MiVision Legacy Portal Mock & Record Video for Case 2

## Output
Save the final .webm video to: `/tmp/hsbc-demo/public/data/Case2_MiVision_Browser_Recording.webm`

## What to Build

### 1. Create a Legacy HTML Portal Mock
Create a single self-contained HTML file at `/tmp/hsbc-demo/mock_mivision_case2.html` that looks like a **2010-era enterprise banking system** (NOT modern). Think: grey backgrounds, small Arial/Verdana fonts, thick borders, table-based layouts, no rounded corners, no shadows, no gradients.

**System Name:** MiVision Card Management System
**Header:** "MiVision Card Management — HSBC Commercial Banking" with a breadcrumb: Home > Card Management > Cardholder Profile
**Session info:** User: S.OKONKWO | Session: MV-20260309-1008 | Last Login: 09-Mar-2026 10:02

**Content — Cardholder Profile View:**

| Field | Value |
|-------|-------|
| Cardholder | Richard Okafor |
| Title | Head of Technology |
| Client | Clifford Chance LLP |
| Programme | CC-PROG-UK-0112 |
| Card Number | ****7732 |
| Card Type | P-Card (Purchasing Card) |
| Card Status | **Active** |
| Current Limit | GBP 20,000 |
| MTD Balance | GBP 17,840 |
| MTD Utilisation | **89.2%** (highlight in amber/orange) |
| Available Credit | GBP 2,160 |
| Last Transaction | 07-Mar-2026 — GBP 2,940 — SIGMA ELECTRONICS TRADE |

**CRITICAL SECTION — Internal Flag Alert:**
Show a prominent **WARNING** banner with a yellow/amber background:
```
⚠ INTERNAL FLAG — Account flagged for review — see linked alert
Alert Reference: SAS-2026-0307-77321
Flag Date: 07-Mar-2026 23:14 GMT
Status: ACTIVE — Requires Fraud Operations review
Policy: Section 6.1.4 — No limit amendment may be processed while a fraud alert remains active
```

**Recent Transactions Table** (last 5):

| Date | Description | MCC | Amount | Status |
|------|-------------|-----|--------|--------|
| 07-Mar-2026 21:08 | SIGMA ELECTRONICS TRADE | 5065 | GBP 2,940.00 | Posted |
| 05-Mar-2026 20:41 | TECHPOINT SUPPLIES LTD | 5065 | GBP 3,120.00 | Posted |
| 02-Mar-2026 19:22 | TECHPOINT SUPPLIES LTD | 5065 | GBP 2,840.00 | Posted |
| 28-Feb-2026 09:15 | MICROSOFT UK LTD | 7372 | GBP 4,200.00 | Posted |
| 25-Feb-2026 14:30 | AMAZON WEB SERVICES | 7372 | GBP 2,740.00 | Posted |

**Footer:** "MiVision v8.4.2 | HSBC Internal Use Only | Data Classification: RESTRICTED"

### Design Rules
- Use Arial or Verdana font, 11-12px
- Background: #f0f0f0 or #e8e8e8 (light grey)
- Table borders: 1px solid #999
- Header: dark blue (#003366) with white text
- No CSS animations, no hover effects, no modern UI
- Flag/warning section: yellow background (#fff3cd) with dark border

### 2. Record with Playwright
Create a Playwright script at `/tmp/hsbc-demo/record_mivision_case2.cjs` that:
- Launches Chromium headless with `recordVideo: { dir: '/tmp/agent_output/', size: { width: 1280, height: 800 } }`
- Uses `slowMo: 80`
- Opens the HTML file via `file:///tmp/hsbc-demo/mock_mivision_case2.html`
- Scrolls slowly through the page, pausing at key sections
- Total recording: 10-15 seconds
- **CRITICAL:** Call `await context.close()` BEFORE `await browser.close()` to flush the video
- Copy/rename the output .webm to `/tmp/hsbc-demo/public/data/Case2_MiVision_Browser_Recording.webm`

### 3. Run the Script
```bash
cd /tmp/hsbc-demo && npx playwright install chromium 2>/dev/null
node /tmp/hsbc-demo/record_mivision_case2.cjs
```

Verify the output file exists and is > 100KB.
