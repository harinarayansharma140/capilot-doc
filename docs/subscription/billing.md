---
title: Billing & subscription management
---

# Billing & subscription management

Razorpay-backed subscription with mid-cycle seat proration and self-serve cancel.

![Firm billing](/img/screens/19-firm-billing.png)

## What's working

- **Self-signup → 30-day trial** with no card on file. Trial start + end stamped on the Firm row (`SubscriptionStatusId = Trial`, `TrialEndsOn = today + 30`).
- **Trial expiry write-gate** — `ControllerBase.dispatch` returns HTTP 402 + code `SUBSCRIPTION_EXPIRED` on save / delete / export when status flips to Expired. Reads pass through (firm can still view + export their data after expiry). Full-width amber/red banner appears across the page.
- **Daily cron** at 04:30 IST flips `Trial → Expired` when `TrialEndsOn < today`. Idempotent.
- **Razorpay Checkout** — public-key fetched from backend, Checkout JS opened on Pay, subscription_id + payment_id + signature post-back HMAC-verified.
- **Webhook handler** at `/webhooks/razorpay` — HMAC-SHA256 raw-body verification. Handles `subscription.charged → Active`, `subscription.halted → PastDue`, `subscription.cancelled → Cancelled`.
- **Mid-cycle seat proration**:
  - **Increase**: pro-rated charge immediately via Razorpay add-on (`unit × discount × daysRemaining / cycleDays × addedSeats`). Razorpay quantity update also fires for the next cycle.
  - **Decrease**: credited to `CreditBalanceMinor` on the FirmSubscription row; applied automatically against next renewal invoice.
- **SubscriptionSeatChange audit table** — one row per increase/decrease with the math: old/new seats, days remaining, cycle days, paise charged or credited.
- **Cancel at period end** — `cancelAtCycleEnd = true` on Razorpay; access continues until the period ends.
- **SuperAdmin discount admin** at `/admin/billing` — list every firm's subscription, set per-firm `DiscountPercent` (0–100) with audit reason. Applies to MRR and proration math.

## What's stub / pending

- **Failed-charge retry policy** — Razorpay's default retry stack (3 attempts) is in place; CAPilot doesn't yet send a "your card was declined" email on the first failure. Polish.
- **Invoice PDF for the subscription** itself — Razorpay generates one (visible in their dashboard); a CAPilot-branded one would be a polish slice.
- **Plan switching** (monthly ↔ annual mid-cycle) — not yet built. Workaround: cancel + re-subscribe at the new cadence.
- **Multi-firm under one login** — Practice tier feature in the pricing sketch; not built. v0 enforces one firm per Security_User via Staff link.
