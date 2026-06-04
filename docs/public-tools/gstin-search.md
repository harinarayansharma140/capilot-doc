---
title: GSTIN search
---

# GSTIN search

Public, no-sign-in tool — paste a GSTIN, see legal name, trade name, status, principal place, filing frequency, latest returns.

![GSTIN lookup](/img/screens/03-gstin-lookup.png)

## What it does

- Validates the 15-char GSTIN format server-side.
- Decodes the state code from chars 0–1 (e.g. `27` → Maharashtra) and the embedded PAN from chars 2–11.
- Hits the configured provider (stub in dev, paid wrapper in prod) and renders the structured profile in a Descriptions panel.

## Try it

[/tools/gstin-lookup](http://localhost:5173/tools/gstin-lookup) — sample GSTIN `27AAAPL1234C1Z5` is one click away.

## What's stub / pending

The lookup wrapper has three modes:

1. **STUB** (default, no env keys) — returns realistic but synthetic data based on the GSTIN's encoded fields (state, PAN entity type from PAN's 4th char). Page shows a yellow "Demo data · stub mode" tag.
2. **SANDBOX** — Sandbox.co.in's `/gst/compliance/public/search_gstin` endpoint. Free trial, then ~₹0.40-0.50/call. Wrapper branch is wired with a placeholder; real fetch is ~15 min of additional work once a key lands in `.env`.
3. **CUSTOM** — generic provider with `GSTN_LOOKUP_URL` + `GSTN_API_KEY`. Use for any wrapper API.

**Why not auto-fetch from the real GSTN portal?** `services.gst.gov.in/services/searchtp` is gated by F5 TrafficShield (anti-bot JS challenge) + image CAPTCHA. Server-side fetch is blocked. The real data costs either a GSP partnership (₹2 cr capital requirement — out of reach) or a paid wrapper API.

**Honest fallback (Path B)** — on the Client onboarding form, the GSTIN field has a "🔗 Verify on GSTN portal" link that opens the official GSTN search in a new tab with your GSTIN copied to clipboard. CA solves the CAPTCHA, sees authoritative data, types it back. Zero cost.
