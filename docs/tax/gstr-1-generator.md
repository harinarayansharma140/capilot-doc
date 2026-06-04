---
title: GSTR-1 JSON generator
---

# GSTR-1 JSON generator

The firm's own monthly outward-supply return, generated from CAPilot's invoice data, ready to upload at gst.gov.in.

![GSTR-1 export](/img/screens/18-gstr1-export.png)

## What's working

- **One filing-period at a time** — month picker defaults to last month (CA filing rhythm — GSTR-1 due 11th of next month).
- **Live preview** — counts (B2B / B2CL / B2CS / distinct customers), totals (taxable / tax / total invoice value) before download.
- **JSON sections** generated per GSTN spec:
  - **b2b** — invoices to registered customers (recipient has GSTIN), full invoice-level detail per recipient
  - **b2cl** — inter-state B2C, invoice value > ₹2,50,000, invoice-level detail per POS state
  - **b2cs** — other B2C aggregated by (POS state, rate)
  - **hsn** — HSN-wise summary across all sections, IGST vs CGST+SGST correctly split per-line by the invoice's intra/inter classification (mandatory since FY 2022-23)
  - **doc_issue** — range of invoice numbers issued in the period + cancelled count
- **GST math**:
  - POS state = firm's GSTIN state → intra-state → CGST + SGST (each = rate / 2)
  - POS state ≠ firm's GSTIN state → inter-state → IGST (= rate)
- **Status filtering** — only "live" invoices (Sent / PartiallyPaid / Paid / Overdue) appear in b2b/b2cl/b2cs sections. Cancelled invoices count only in `doc_issue.cancel`. Draft / WrittenOff / Rejected excluded entirely.
- **Firm-GSTIN-missing banner** with a link to Firm Settings — won't try to generate a return without a valid firm GSTIN.
- **Empty-period state** — "No live invoices in May 2026. GSTR-1 will be nil for this period." with Open Invoices link.

## Verified math

Synthetic test — 3 invoices for HSN 998212 (mixed intra-state Maharashtra + inter-state Karnataka):

| Invoice | POS | Taxable | Tax (18 %) | Split |
|---|---|---|---|---|
| TUL/0001 | MH (intra) | ₹10,000 | ₹1,800 | CGST ₹900 + SGST ₹900 |
| TUL/0003 | KA (inter) | ₹2,50,000 | ₹45,000 | IGST ₹45,000 |
| TUL/0004 | MH (intra) | ₹5,000 | ₹900 | CGST ₹450 + SGST ₹450 |
| **HSN row** | — | **₹2,65,000** | **₹47,700** | **IGST 45,000 + CGST 1,350 + SGST 1,350** |

The HSN row correctly splits IGST and CGST+SGST per the underlying line's intra/inter classification — same HSN sold to mixed POS aggregates into one row with the right component breakdown.

## What's stub / pending

- **CDNR / CDNUR** (credit / debit notes — `CreditNote` table exists but not yet wired into the GSTR-1 generator)
- **EXP** (export invoices — rarely used by small CA firms)
- **NIL** (nil-rated / exempt — rare)
- **GSTR-3B** — companion summary return. Natural next slice; same data pipeline.
- **GSTR-2B reconciliation** — match firm purchases against 2B JSON downloaded from gst.gov.in, flag mismatches.

Upload path on the GST portal: Login → Returns → GSTR-1 → Prepare Offline → Upload.
