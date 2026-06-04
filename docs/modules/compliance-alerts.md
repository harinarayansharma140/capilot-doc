---
title: Compliance alerts
---

# Compliance alerts

CAPilot tracks each task's alert as a **lifecycle** (one row per incident, with status), not a firing log. So when the cron decides "GSTR-3B for Acme Pharma is T-3 days from due", it opens an Alert row, attaches a bell notification, and **doesn't fire again** when T-1 happens — the same row updates with `ThresholdsFired = 'T-3,T-1'`.

## What's working

- **Five thresholds**: T-7, T-3, T-0 (today), T+1 overdue, T+3 escalated.
- **Lifecycle states**: Open → Acknowledged → Closed (manual) / AutoClosed (when task moves to Filed).
- **Bell badge** on the top-bar — count of unacknowledged staff notifications, polls `/api/StaffNotifications/unreadCount`.
- **Real-time push via SSE** — `/api/realtime/staff-notifications` keeps multiple browser tabs in sync; mark-as-read in tab A reflects in tab B without polling.
- **Dedicated `/practice/alerts` page** — Active / Closed / All toggle, drill into the task.
- **Auto-close** when the underlying task DueDate moves past today, or when the task moves to Filed/Done.

## What's stub / pending

- **Email digest** for partners — separate from the per-event email. A daily digest at 7am would be useful.
- **Slack / WhatsApp** push channels — defer to a paid add-on tier.
