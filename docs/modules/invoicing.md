---
title: Invoicing
---

# Invoicing

GST-aware, recurring-friendly, with TDS settlement built in.

![Invoices list](/img/screens/15-invoices.png)

## What's working

- **GST math**:
  - Client state code from GSTIN → intra-state (CGST + SGST half-half) vs inter-state (IGST).
  - Per-line `HSNCode` + `TaxRate` → `TaxAmount` auto-computed.
  - `IsGSTRegistered = 0` clients → no GST, plain invoice.
- **Firm-scoped invoice numbering** — `Firm.InvoiceNumberPrefix` (e.g. 'TUL') + FY ("26-27") + padded series → `TUL/26-27/0001`. Atomic counter via `InvoiceCounter` table — gapless allocation, race-free.
- **Recurring engagements** — `ClientService` × frequency × due-date math materialises monthly invoices for retainer clients. Daily cron at 5am IST (`IssueRecurringInvoices` task).
- **TDS handling** (Slice F2/F3):
  - `Client.IsTDSDeductor = 1` → auto-compute `TDSAmount = 10% of Subtotal`.
  - Payment-time settlement — when a client pays ₹X net-of-TDS, our `InvoicePayment` row captures TDSDeducted; F3 ledger tracks `TDSCredit` lifecycle (Deducted → Reflected in 26AS → Claimed in ITR).
- **Credit notes** — `CreditNote` table with state machine (Draft / Issued / Cancelled), linked to original invoice, GST Act §34 compliant.
- **PDF rendering** — `lib/invoicePdf.mjs` produces a clean A4 invoice PDF with firm logo, GST breakdown, terms, bank details.
- **Bulk email send** — Slice 18c sends overdue-invoice reminders via SendGrid daily at 5am with PDF attached, per-firm cadence config (FirmReminderConfig), de-duped to prevent double sends.
- **Excel import** — invoices + lines via multi-sheet template, transient natural key (`InvoiceRef` matches parent rows to child lines).

## What's stub / pending

- **e-Invoice IRN push** — needs GST Suvidha Provider (GSP) onboarding. The data model is e-Invoice ready (`Firm.InvoiceNumberPrefix`, GSTIN, HSN, place of supply); only the actual API call to NIC is missing.
- **GSTR-1 inclusion preview** — clicking an invoice could show "this will appear in GSTR-1 section: b2b" with the row preview.
- **Multi-currency** — INR-only today. Foreign-currency export invoices would need extra modeling.
