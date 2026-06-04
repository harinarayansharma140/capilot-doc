---
title: Income-tax calculator
---

# Income-tax calculator

Side-by-side old vs new regime, dual financial-year toggle covering both the IT Act 1961 (FY 2025-26) and the IT Act 2025 (FY 2026-27, effective 1 April 2026).

![Tax calculator](/img/screens/02-tax-calculator.png)

## What's working

- **Tax-year toggle**:
  - FY 2025-26 (AY 2026-27) — IT Act, 1961
  - FY 2026-27 (Tax Year 2026-27) — IT Act, 2025
- **Regime side-by-side**: old vs new, recomputed live as you type (debounced 250ms).
- **§87A rebate**:
  - Old regime: ₹12,500 cap, taxable ≤ ₹5,00,000
  - New regime: ₹60,000 cap, taxable ≤ ₹12,00,000 + **marginal relief band** in the ₹12L–₹13L range so a ₹12.1L salary pays ~₹10k, not ~₹61.5k
- **Slabs**: new-regime slabs identical for FY 2025-26 + FY 2026-27 per Finance Act 2025 + FA 2026. Old-regime age-banded (Senior / Super Senior get higher exemption).
- **Surcharge**: 10 % / 15 % / 25 % bands. New regime capped at 25 % (no 37 %).
- **Cess**: 4 % Health & Education on (tax + surcharge).
- **Deductions**: Chapter VI-A (80C / 80D / 80G / 80E / 80TTA) — old regime only; Employer NPS 80CCD(2) — both regimes.
- **Recommendation banner** — "New regime is cheaper by ₹X,XXX for this profile" with explanation of why.
- **IT Act 2025 notice** when FY 2026-27 selected — §87A → §156, AY/PY → "Tax Year", TDS section renumbering (192/194 → 392/393).

## Try it

[/tools/tax-calculator](http://localhost:5173/tools/tax-calculator) — public, no sign-in. Useful as a shareable URL: paste your salary + 80C + TDS, see both regimes instantly.

## Verified math

Income ₹15,00,000 + ₹50k interest, ₹1.5L 80C, ₹80k TDS, FY 2026-27:

| Regime | Taxable | Tax | Balance |
|---|---|---|---|
| Old | ₹13,00,000 | ₹2,10,600 | ₹1,30,600 due |
| **New** | ₹14,25,000 | **₹97,500** | **₹17,500 due** |

New regime cheaper by ₹1,13,100 (Chapter VI-A disallowed in new regime, but lower slabs + §87A absent at this income offset that).
