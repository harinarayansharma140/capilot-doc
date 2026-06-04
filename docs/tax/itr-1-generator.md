---
title: ITR-1 JSON generator
---

# ITR-1 JSON generator

Save a complete tax scenario per (client × tax year) → download the official ITR-1 JSON the CA uploads at incometax.gov.in.

![Tax scenarios](/img/screens/17-tax-scenarios.png)

## What's working

- **TaxScenario table** — one row per (Firm × Client × TaxYear) with denormalised assessee identity (PAN, DOB, address, employer, bank for refund). Stays intact even if the linked Client row changes later.
- **Form drawer** captures every field ITR-1 needs:
  - Filing context (Tax year, Regime, Age band, Status)
  - Assessee identity (Name, PAN, DOB, mobile, email)
  - Address (address line 1 + 2, City, IT-Dept state code, PIN)
  - Income heads (gross salary, employer + TAN, house property, interest income, agri income up to ₹5k)
  - Deductions (Chapter VI-A, employer NPS)
  - Taxes paid (TDS, advance tax)
  - Refund bank (account no, IFSC, bank name)
- **Server recomputes tax on every save** so the cached `ComputedTotalTax / Refund / BalanceDue` columns are always in step with the inputs. Grid displays the math.
- **Download ITR-1 JSON** — single button per row. Generates a JSON file shaped to the IT Dept's ITR-1 schema with sections:
  - `Form_ITR1` — form metadata (AssessmentYear, FormName, FormVer, SchemaVer)
  - `PersonalInfo` — name, PAN, address, DOB, employer category
  - `FilingStatus` — return-file-section, NewTaxRegime flag, return type
  - `ITR1_IncomeDeductions` — gross salary, std deduction (Us16ia), house property, other sources, agri exempt, Chapter VI-A breakdown, taxable
  - `ITR1_TaxComputation` — slab tax, §87A rebate, surcharge, cess, net liability
  - `TaxPaid` — TDS + advance + self-assessment + total + balance payable
  - `TDSonSalaries`, `TDSonOthThanSals` — per-deductor rows (table-form)
  - `Refund` — bank account, IFSC
  - `Verification` — assessee name, PAN, place, date

CA uploads at incometax.gov.in → Login → e-File → Income Tax Return → Upload JSON.

## What's stub / pending

- **Schema drift** — IT Dept refreshes the ITR-1 schema each AY. Banner on the page reminds CAs to verify against the current official schema before submission. Future polish: schema-version check + auto-warn when a generated JSON references an older AY's schema.
- **ITR-2 / ITR-3 / ITR-4** generators — same shape, different sections. Defer until ITR-1 is verified end-to-end by a CA against a real filing.
- **Auto-import from previous year** — copy the last year's scenario, bump dates, recompute. Polish.
