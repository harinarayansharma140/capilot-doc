---
title: Payments & TDS settlement
---

# Payments & TDS settlement

When a client pays an invoice net of TDS — the most common pattern in B2B India — CAPilot captures both the cash and the withheld tax.

## What's working

- **InvoicePayment** rows per invoice — `{ Date, Mode (UPI/Bank/Cheque/Cash/Online), Amount, TDSDeducted, ReferenceNo }`.
- **Status transitions**: Sent → PartiallyPaid → Paid driven by `Σ Payments + Σ TDS ≥ Total`.
- **TDSCredit ledger** (Slice F3):
  - One row per (Invoice × Payment) with status `Deducted` initially.
  - CA flips to `Reflected` once it appears on Form 26AS.
  - Flips to `Claimed` when included in the firm's ITR.
- **Aging report** — Receivables aged into buckets (0-30 / 31-60 / 61-90 / 90+), surfaced on the dashboard's AR-aging tile.

## What's stub / pending

- **Form 26AS auto-match** — CA enters TDS row manually today; matching against an uploaded 26AS PDF would save typing.
- **Bank reconciliation** — Slice BankReconcile exists (separate page) but is not yet wired to invoice payments. A "match this bank line to invoice X" affordance is the polish slice.
