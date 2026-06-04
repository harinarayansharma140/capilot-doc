---
title: Communications
---

# Communications

Every client touchpoint — emails, WhatsApp logs, calls, meetings, internal notes — in one log with a PMLA audit trail.

![Communications](/img/screens/14-communications.png)

## What's working

- **Channel taxonomy**: Email, WhatsApp, Phone, Meeting, SMS, Letter, Internal Note.
- **Direction**: Inbound / Outbound / N/A (for internal notes).
- **Status lifecycle**: Logged → Awaiting response → Followed up → Closed.
- **Outbound compose + send** (Slice C4) — write subject + body, supports `{{ClientName}}`, `{{FirmName}}`, `{{TodayDate}}` placeholders rendered server-side; SendGrid ships the email and the row is logged with `SentVia = 'CAPilotEmail'`, `MessageStatus = 'Sent'`, `SendGridMessageId` captured for the future delivery-event webhook.
- **Template library** — `CommunicationTemplate` rows keyed by purpose (chase-payment, GST-due-reminder, ITR-ready-for-review, etc.) with subject + body. Pick one in the compose modal, it pre-fills + you edit.
- **Linked task / signatory** — cross-link a comm to the `ComplianceTask` or `ClientSignatory` it's about. Tabs on the Client form and Task form expose the linked log.
- **Invoice rejection workflow** — when a portal client rejects an invoice, a `CommunicationLog` row + `StaffNotification` fires; the CA gets bell + email; clearing the rejection notifies the portal client back.

## What's stub / pending

- **Delivery-event webhook** (SendGrid → CAPilot) — flips `MessageStatus` Sent → Delivered / Bounced / Failed. Wrapper logic is in place; webhook URL just needs to be registered in the SendGrid dashboard for production.
- **WhatsApp Business API** — currently a "log what you sent manually" channel. Auto-send via WhatsApp Business needs Meta onboarding.
- **AI draft replies** — premium-tier feature on the roadmap.
