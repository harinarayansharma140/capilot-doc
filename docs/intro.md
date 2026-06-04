---
slug: /
sidebar_position: 1
title: What is CAPilot
---

# CAPilot

**The compliance + billing workspace for India's practising CAs.**

Stop chasing GSTR deadlines across three Google calendars, recovering lost billable hours from sticky-note time-sheets, and digging through five Drive folders for last year's working papers. CAPilot is the single workspace built for the way an Indian CA firm actually runs.

## Who it's for

- **CA proprietors and partnerships** — solo or up to 25 staff. Pricing scales by active seat, no per-client surcharge.
- **Compliance-heavy practices** — GSTR-1 / 3B / 9, TDS, ITR, tax audits, ROC filings, labour returns, ICAI peer reviews.
- **Firms that bill on time** — recurring engagements, hourly billing, retainer mix; CAPilot turns time entries into GST-aware invoices in one click.

## What's shipped today

| Domain | What's in it |
|---|---|
| **Compliance** | Pre-generated tasks (12 months ahead), monthly calendar, alert lifecycle (T-7 / T-3 / T-0 / T+1 / T+3), assignment + reassignment |
| **Time tracking** | Hourly entries, "Others" (non-client) time, weekly timesheet rollup |
| **Invoicing** | GST-aware (CGST/SGST split, IGST, e-Invoice prefix), recurring invoices, TDS settlement (Slice F2/F3), credit notes |
| **Client management** | Onboarding wizard with PAN/GSTIN/CIN validation, contacts, addresses, signatories, DSCs, registrations, bank accounts, services |
| **Communications** | Outbound email via SendGrid, template library, full log with PMLA audit trail, invoice-rejection workflow |
| **Client portal** | Read-only invoices / credit notes / documents + invoice-reject workflow |
| **Tax tools** | Income-tax calculator (1961 ↔ 2025 Act toggle), ITR-1 JSON generator, GSTR-1 JSON generator |
| **Free public tools** | GSTIN search, MCA21 lookup, HSN/SAC rate finder — no sign-in needed |
| **Subscription** | Self-signup with 30-day free trial, ₹599/staff/mo, Razorpay billing, mid-cycle seat proration, SuperAdmin discount admin |

## What's intentionally NOT built (yet)

We're not pretending CAPilot does everything. Pieces deliberately left for later — usually pending CA feedback on whether they actually want them:

- **GSTR-3B / 2A / 2B** — only GSTR-1 ships today. 3B is a natural next slice; 2B reconciliation is heavier.
- **Form 16 / Form 130 generators** — the TDS certificate forms (Form 130 replaces Form 16 from 1 April 2026 under the IT Act 2025). Pending CA spec review before we model the layout.
- **Tally / Zoho Books import** — flagged for next round of integration work.
- **e-Invoice IRN push** — needs a GST Suvidha Provider (GSP) partnership; not v0.
- **AI-assisted features** — drafting client replies, summarising threads. Premium-tier worthy; deferred until plans are decided.

See **[Roadmap](/roadmap)** for the current open list.

## How to read this site

The left sidebar is grouped by **module** (what the CA touches in their day). Each page is short:

1. **Screenshot first** — what it looks like.
2. **What's working** — features verified end-to-end.
3. **What's stub / pending** — honest about gaps.
4. **Try it** — link into the running app.

If you're showing this to a CA for feedback, **[Getting started](/getting-started)** is the right next page.
