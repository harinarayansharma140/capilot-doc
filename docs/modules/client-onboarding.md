---
title: Client onboarding
---

# Client onboarding

Onboard a corporate or individual client with full statutory IDs (PAN / GSTIN / TAN / CIN / LLPIN) in one form.

![Clients list](/img/screens/13-clients-list.png)

## What's working

- **One form, many sub-grids** — Identity, Statutory IDs, Invoicing config, plus tabs for Contacts / Addresses / Signatories / DSCs / Registrations / Bank accounts / Services / Communications. Each tab is a "local grid" — edit rows in-line, save all together with the parent.
- **GSTIN-first autofill** — paste a 15-char GSTIN and PAN auto-extracts (chars 3-12).
- **Real-data cross-check** — click "🔗 Verify on GSTN portal ↗" next to the GSTIN field; the official GSTN search opens in a new tab with your GSTIN already on clipboard. Solve the CAPTCHA, see the authoritative legal name + address, type it back.
- **Same flow for CIN** — "🔗 Verify on MCA21 portal ↗" deep-link.
- **Cross-field validation** — server enforces:
  - GSTIN chars 3-12 == PAN (no mismatch on save)
  - PAN 4th char matches `ClientType.CustomStringValue` (P = Sole Proprietor, F = Firm, C = Company, T = Trust, H = HUF, A = AOP)
  - Date of incorporation can't be in the future
  - At least one Address row with `IsPrimary = 1`
- **Excel import** — multi-sheet template (`Clients`, `Contacts`, `Addresses`, etc.) with partial commit — bad rows reported, good rows committed.

## What's stub / pending

- **Auto-fetch legal name from GSTIN / CIN** — would call a paid wrapper API (Sandbox / Probe42 / AppyFlow). Wrappers exist in `lib/gstinLookup.mjs` and `lib/mca21Lookup.mjs` with stub mode for dev. Disabled in the live Client form to avoid misleading users with synthetic stub data; flip back on the moment a provider key lands in `.env`.
- **DigiLocker pull** for PAN / Aadhaar of signatories — needs API Setu partner application.
