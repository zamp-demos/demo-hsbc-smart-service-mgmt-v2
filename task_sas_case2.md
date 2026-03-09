# Task: Build SAS Fraud Management Legacy Portal Mock & Record Video for Case 2

## Output
Save the final .webm video to: `/tmp/hsbc-demo/public/data/Case2_SAS_Browser_Recording.webm`

## What to Build

### 1. Create a Legacy HTML Portal Mock
Create a single self-contained HTML file at `/tmp/hsbc-demo/mock_sas_case2.html` that looks like a **legacy SAS Fraud Management enterprise system** — dark navy/charcoal theme, dense data tables, small monospace/Arial fonts, NO modern UI. Think 2008-2012 enterprise fraud analytics.

**System Name:** SAS Fraud Management — Investigation Console
**Header:** Dark navy (#1a1a2e or #0d1b2a) with "SAS Fraud Management" branding, breadcrumb: Dashboard > Alerts > Alert Detail
**Session info:** Analyst: S.OKONKWO (Read-Only) | FDAR: FDAR-2026-0309-0441 | Session expires: 14:14 GMT

**Alert Summary Section:**

| Field | Value |
|-------|-------|
| Alert ID | SAS-2026-0307-77321 |
| Status | **OPEN** (red indicator) |
| Risk Score | **74 / 100** (show as gauge or colored bar — block threshold: 85) |
| Created | 07-Mar-2026 23:14 GMT |
| Age | 48 hours |
| Assigned To | **UNASSIGNED** (highlight in red) |
| Card | ****7732 — Richard Okafor |
| Programme | CC-PROG-UK-0112 — Clifford Chance LLP |
| Alert Category | Behavioral Anomaly — Transaction Pattern |

**Trigger Analysis Table:**

| # | Trigger | Detail | Weight |
|---|---------|--------|--------|
| 1 | New MCC Activity | First activity in MCC 5065 (Electronic Parts & Equipment) | 28/100 |
| 2 | Off-Hours Pattern | All 3 transactions between 19:00-21:30 GMT | 24/100 |
| 3 | High MTD Velocity | 117% above 6-month rolling average | 22/100 |

**Flagged Transactions Table:**

| Date/Time | Merchant | MCC | Amount | Auth Code | Status |
|-----------|----------|-----|--------|-----------|--------|
| 07-Mar-2026 21:08 | SIGMA ELECTRONICS TRADE | 5065 | GBP 2,940.00 | A7732-0921 | Authorized |
| 05-Mar-2026 20:41 | TECHPOINT SUPPLIES LTD | 5065 | GBP 3,120.00 | A7732-0520 | Authorized |
| 02-Mar-2026 19:22 | TECHPOINT SUPPLIES LTD | 5065 | GBP 2,840.00 | A7732-0219 | Authorized |

**Total Flagged Amount:** GBP 8,900.00

**Risk Score Gauge:** Show a visual gauge/bar from 0-100 with zones:
- 0-40: Green (Low)
- 41-70: Amber (Medium)  
- 71-84: Orange (High)
- 85-100: Red (Block)
Current score 74 should be in the Orange/High zone.

**Audit Trail Log** (bottom section):
```
[07-Mar-2026 23:14:02] SYSTEM: Alert generated — behavioral anomaly triggers activated
[07-Mar-2026 23:14:03] SYSTEM: Risk score calculated: 74/100 (below block threshold 85)
[07-Mar-2026 23:14:03] SYSTEM: Alert queued for Fraud Operations review
[09-Mar-2026 10:14:19] SYSTEM: FDAR-2026-0309-0441 — read-only access granted to S.OKONKWO
[09-Mar-2026 10:14:22] ACCESS: S.OKONKWO opened alert detail (read-only session)
```

**Footer:** "SAS Fraud Management v9.4 | HSBC Fraud Operations | Classification: HIGHLY RESTRICTED"

### Design Rules
- Dark theme: navy/charcoal backgrounds (#0d1b2a, #1a1a2e, #16213e)
- Text: light grey (#c8c8c8) or white
- Tables: dark borders, alternating dark row shading
- Font: Arial or Consolas/monospace, 11-12px
- Warning/alert indicators: red (#dc3545) for OPEN, UNASSIGNED
- Risk gauge: colored bar or simple visual indicator
- NO modern CSS (no flexbox layouts, no rounded corners, no shadows)
- Dense, information-heavy layout typical of fraud analytics tools

### 2. Record with Playwright
Create a Playwright script at `/tmp/hsbc-demo/record_sas_case2.cjs` that:
- Launches Chromium headless with `recordVideo: { dir: '/tmp/agent_output/', size: { width: 1280, height: 800 } }`
- Uses `slowMo: 80`
- Opens the HTML file via `file:///tmp/hsbc-demo/mock_sas_case2.html`
- Scrolls slowly through all sections (alert summary → triggers → transactions → risk gauge → audit trail)
- Total recording: 12-18 seconds
- **CRITICAL:** Call `await context.close()` BEFORE `await browser.close()` to flush the video
- Copy/rename the output .webm to `/tmp/hsbc-demo/public/data/Case2_SAS_Browser_Recording.webm`

### 3. Run the Script
```bash
cd /tmp/hsbc-demo && npx playwright install chromium 2>/dev/null
node /tmp/hsbc-demo/record_sas_case2.cjs
```

Verify the output file exists and is > 100KB.
