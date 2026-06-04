---
sidebar_position: 99
title: Roadmap
slug: /roadmap
---

# Roadmap

What's coming, what's deliberately deferred, and why. The goal is to validate every next slice with a practising CA before building — so this list is **soft**, not committed.

## Awaiting CA verification (highest priority)

Before adding more, we want a CA to sit with what's shipped and tell us what's actually useful day-to-day vs. what's noise. Most-needed first:

1. **ITR-1 JSON** — generate against a real client's FY 2025-26 data, attempt upload at `incometax.gov.in`, confirm acceptance. Schema may need tweaks per current AY.
2. **GSTR-1 JSON** — generate against a real firm's May 2026 invoices, upload at `gst.gov.in` Returns → Prepare Offline. Confirm acceptance.
3. **Income-tax calculator** — sanity-check old vs new regime math for a few real assessee profiles.
4. **Compliance calendar** — does the 12-month-ahead pre-generation align with a CA's actual filing cadence? Do alert thresholds (T-7/T-3/T-0/T+1/T+3) feel right?

## Likely next slices (post-CA feedback)

| Slice | What | Why now |
|---|---|---|
| **GSTR-3B** | Companion summary return to the GSTR-1 we already ship. Same data pipeline. | Every GST-registered client files monthly. |
| **Form 16 + Form 130 generators** | TDS-on-salary certificate. Form 16 for legacy FY 2025-26 income (1961 Act); **Form 130** for FY 2026-27 onwards (IT Act 2025, Rule 215 of Income-tax Rules 2026, Notification 22/2026 dated 20 March 2026). Same `TDSCertificate` table, template chosen by Tax Year. | Transition season — CAs issue both shapes through calendar 2026. |
| **Tally / Zoho Books import** | One-click pull of vouchers, ledger balances, parties into CAPilot. | Reduces double-entry; biggest single ask from CAs in informal conversations. |
| **GSTR-2B reconciliation** | Upload GSTR-2B JSON downloaded from `gst.gov.in`, match against firm's purchase invoices, flag mismatches. | High-value for input-credit accuracy. |
| **Practice analytics dashboard** | Consolidated KPIs: compliance success rate, AR aging, time utilization by staff, top clients by revenue, MRR trajectory. | Visible-every-day value once a CA has been on CAPilot for 30+ days. |
| **e-Invoice IRN push** | Wire `Invoices.sendIRN` against the NIC sandbox / a GSP partner. Data model is already e-Invoice ready. | Mandatory for turnover ≥ ₹5 cr; nice-to-have below. |
| **AI-assisted features** | LLM-powered: draft client reply, summarise a long communication thread, extract data from an uploaded document. | Differentiator + premium-tier worthy. Distinct project from the compliance-heavy core. |

## Deferred — only if specifically requested

- **WhatsApp Business API** — Meta onboarding overhead. v0 logs WA conversations manually.
- **Multi-firm under one login** — pricing sketch had this as Practice tier; not actually requested by any v0 customer yet.
- **OCR-based invoice scan / vendor bill extraction** — touches the AI roadmap.
- **Native mobile app** — web-responsive works; native is a real investment.

## Will NOT build (out of scope or wrong fit)

- **Standalone accounting / book-keeping** — that's Tally / Zoho Books / QuickBooks territory. CAPilot integrates with them, doesn't replace them.
- **Income-tax filing portal** for end-clients — that's the IT Dept's job. CAPilot generates the JSON; users upload.
- **Statutory audit tool** for full audit working papers — adjacent but heavy domain. Possibly a future product.

## Pending operational decisions

These aren't code; they need your call:

1. **Real GSTN / MCA21 provider keys** — sign up for Sandbox.co.in or Probe42 → the autofill in Client onboarding lights up automatically (wrapper code is wired with a placeholder, ~15 min to drop in the real fetch once keys land).
2. **Live Razorpay keys for production** — `rzp_live_*` keys are in env today but flagged as live; production launch needs the KYC pipeline complete.
3. **SendGrid for transactional emails** — already wired, just confirm production sender domain is verified.

## Honest list of known gaps

These are real today, surfaced so a CA evaluating CAPilot isn't surprised:

- The GSTIN + MCA lookup pages return **realistic but synthetic stub data** in dev — they explicitly tag "Demo data · stub mode". Real data needs the provider keys above.
- Form 16 / Form 130 — not yet built.
- GSTR-2A / 2B / 3B — not yet built (GSTR-1 only).
- Tally / Zoho Books import — flagged but not yet built.
- Inline HSN autocomplete on Invoice lines — defer to a custom-cell-editor slice.
- Bulk reassign across staff for compliance tasks — polish slice.
- Live-running stopwatch for time entries — log-after-the-fact today.
