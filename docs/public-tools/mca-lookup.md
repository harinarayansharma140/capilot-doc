---
title: MCA21 company lookup
---

# MCA21 company / LLP lookup

Public CIN or LLPIN search — legal name, class, registered office, directors, ROC, paid-up capital.

![MCA lookup](/img/screens/04-mca-lookup.png)

## What it does

- Validates CIN (21 chars, `L/U + 5 industry digits + 2 state letters + 4 year digits + 3 type letters + 6 reg digits`) or LLPIN (7 chars, `AAA-1234`).
- Decodes the CIN's encoded fields:
  - State code → state name (KA = Karnataka, MH = Maharashtra, UW = Uttar Pradesh, etc.)
  - 3-char company-type code → 'Private Limited Company' (PTC), 'Public Limited Company' (PLC), 'OPC', 'Section 8' (NPL), 'Foreign Subsidiary' (FTC), etc.
  - Year of incorporation
- Stub-mode generates an industry-flavoured name from the 2-digit NIC prefix (62 = Tech, 64 = Finance, 15 = Foods, 17 = Textiles, …).

## Try it

[/tools/mca-lookup](http://localhost:5173/tools/mca-lookup) — sample CIN `U72200KA2008PTC047466`.

## What's stub / pending

Same architecture as GSTIN search. Three modes:

1. **STUB** — synthetic data from CIN-decoded fields.
2. **PROBE42** — Probe42 is a leading paid wrapper around the MCA21 V3 portal. `MCA_PROVIDER=probe42` + `PROBE42_API_KEY`.
3. **CUSTOM** — generic provider with `MCA_LOOKUP_URL` + `MCA_API_KEY`.

**Why not auto-fetch from the real MCA portal?** `mca.gov.in`'s V3 master-data search uses HMAC-bound CAPTCHAs — re-submit attempts with the same captcha-HMAC pair are blocked, so OCR+replay doesn't work cleanly. The official MCA bulk-master-data API is ₹0.10/CIN paid; resellers (Probe42, Sandbox, Setu) wrap it with an API key.

**Honest fallback (Path B)** — on the Client onboarding form, the CIN field has a "🔗 Verify on MCA21 portal" link that opens the official `View Company / LLP Master Data` page in a new tab. CA enters the CIN there, sees authoritative data, types it back.
