---
title: Client portal
---

# Client portal

Each client gets a read-only portal — invoices, credit notes, documents, notifications. They can also reject an invoice with comments which fires a workflow on the CA side.

## What's working

- **Separate sign-in** at `/login` with the same form, but a portal-role user sees only `/portal/*` routes.
- **Portal pages**:
  - `/portal/summary` — outstanding balance, last activity
  - `/portal/invoices` + `/portal/invoices/:id` — list + detail
  - `/portal/credit-notes` + `/portal/credit-notes/:id`
  - `/portal/documents` — Drive-backed file viewer
  - `/portal/notifications` — bell with the same SSE push as the CA-side
- **Invoice rejection** (Slice IRW) — portal client picks a reason (Wrong amount / Wrong tax / Duplicate / Wrong billing entity / Other), adds a comment, submits. Server inserts a `CommunicationLog` row + a `StaffNotification` to the CA. On the CA side, the invoice's `StatusName = 'Rejected'`, the comment is visible inline, and they can resolve.
- **Rejection resolution back-channel** (Slice IRW2) — when the CA marks the rejection resolved, the portal client is notified back.

## What's stub / pending

- **In-portal pay** — portal shows "outstanding balance" but no "pay now" button yet (waits on Razorpay-client-portal integration, separate from the CAPilot firm subscription Razorpay).
- **Self-serve credit-note request** — portal client can reject an invoice but can't initiate a credit-note request directly. Polish.
- **WhatsApp portal link share** — auto-share the portal URL when CAPilot sends an invoice email.
