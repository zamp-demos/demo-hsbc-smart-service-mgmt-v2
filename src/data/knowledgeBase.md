# HSBC Smart Service Management — Knowledge Base

## Overview

Pace is HSBC's AI-powered digital employee for Commercial Cards operations. It handles inbound PA (Programme Administrator) requests end-to-end: reading emails, investigating issues across multiple banking systems, taking corrective action, generating reports, and drafting client responses for Service Manager approval.

Smart Service Management is the process framework that governs how Pace resolves multi-request emails from Programme Administrators on behalf of corporate cardholders.

## Systems & Platforms

### MiVision
HSBC's internal card management platform. Used for:
- Viewing cardholder profiles (name, card number, programme, limits, travel regions)
- Activating/deactivating travel regions (country-level granularity)
- Adjusting card limits (temporary or permanent)
- Viewing transaction history and card status

Travel region changes and limit amendments generate unique reference numbers (TRV- and LIM- prefixes). Changes can be set to auto-revert on a specified date.

### Mastercard Smart Data OnLine™
Mastercard's enterprise spend reporting platform. Provides Level 2 and Level 3 transaction data (merchant category, GL codes, line-item detail). Access requires a Data Distribution Request (SD-DDR-2024 form) approved by the client's Global Smart Data Administrator. Once approved, Pace can query transaction data and export reports in the client's preferred format.

### HSBC Authorisation Platform
Internal system for investigating declined transactions. Shows decline codes, timestamps, merchant details, and fraud scores (SAS Fraud Management integration). Common decline codes:
- **Code 57**: Transaction not permitted — geographic restriction
- **Code 51**: Insufficient funds / over limit
- **Code 14**: Invalid card number
- **Code 41**: Lost card
- **Code 43**: Stolen card

### HSBC CRM System
Central case management and client records. Stores PA identity, programme configuration, SLA tier, SM assignment, cardholder records, and case history. Programme policies (POL- prefix) define rules for travel approvals, limit ceilings, and escalation triggers.

## Travel Region Policy

Travel regions control where a corporate card can be used internationally. Rules from programme policy Section 4.2:

- **OECD member countries**: Auto-approval. No SM or PA intervention required beyond the initial request.
- **Non-OECD countries**: Require written PA confirmation. An email from the PA naming the destination constitutes written confirmation.
- **Sanctioned/restricted territories**: Require SM approval and compliance review. Cannot be auto-approved.

Travel activations include a duration and auto-revert date. Multiple regions can be activated simultaneously.

## Limit Change Policy

Card limits can be temporarily or permanently adjusted:

- **Auto-approve ceiling**: GBP 40,000 for MD-level cardholders. Requests at or below this ceiling pass a seven-point policy checklist and require no SM sign-off.
- **Above ceiling**: Requires SM approval and may require additional documentation.
- **Temporary increases**: Auto-revert to original limit on a specified date.
- **Seven-point checklist**: Cardholder seniority, programme policy limits, account standing, prior usage patterns, request justification, duration, and revert date.

## Smart Data DDR Process

When Pace needs spend data from Smart Data OnLine and no CDF3 distribution is configured for the programme:

1. Pace files an SD-DDR-2024 form (read-only access, scoped to specific cardholder and period)
2. An authorisation email is sent to the client's Global Smart Data Administrator
3. Pace continues processing other requests in parallel during the wait
4. Upon approval, Pace queries Smart Data and generates the report
5. Reports can include Level 3 data (merchant detail, GL codes, line items) where available

## Roles

- **Programme Administrator (PA)**: Client-side contact who submits requests on behalf of cardholders. Verified against CRM records.
- **Service Manager (SM)**: HSBC-side consultant assigned to the programme. Reviews and sends final client communications. Handles escalations.
- **Cardholder**: The individual whose corporate card is being serviced. Does not interact with Pace directly — all communication goes through the PA.

## SLA Tiers

- **Priority**: Fastest response commitment. Assigned based on programme value and client tier.
- **Standard**: Normal processing timeline.

SLA compliance is tracked per case and confirmed at case closure.

## Workflow: PA Email — Multi-Request Resolution

1. **Email Intake**: Pace reads inbound email, identifies sender, extracts distinct requests
2. **PA & Programme Verification**: CRM lookup confirms PA identity, loads programme config and policy
3. **Investigation**: For each request, Pace queries the relevant system (Auth Platform for declines, MiVision for card details, Smart Data for spend)
4. **Policy Assessment**: Travel policy, limit policy, and access rules applied per programme
5. **Action Execution**: Changes made in MiVision, forms filed, emails sent — all with audit references
6. **Parallel Processing**: Independent requests (e.g., Smart Data access) run in parallel with other actions
7. **Case Logging**: Full action summary written to CRM with references and SLA confirmation
8. **Response Drafting**: Multi-section email drafted covering all requests, with attachments
9. **SM Review**: Draft queued for Service Manager review and send — SM sees the complete email and can edit before sending
