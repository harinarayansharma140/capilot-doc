---
title: Time tracking
---

# Time tracking

Time entries against engagements that flow straight into invoices.

![Time entries](/img/screens/16-time-entries.png)

## What's working

- **Per-entry mode** — staff logs ` { date, client, hours, description }` rows daily.
- **Others column** — non-client time (training, internal meetings, admin) tracked separately via the `OthersActivity` lookup so it doesn't pollute billable-hours metrics.
- **Inline edit** in the grid — change hours, description, or assignee without opening a modal.
- **Excel import** — multi-sheet template, partial-commit (good rows in, bad rows skipped + reported).
- **External-combo resolution** — paste a staff member's name or email in the Excel; CAPilot maps to StaffId via vwStaffMembersLookupList.

## What's stub / pending

- **Stopwatch / running timer** — currently log post-facto. Live-running stopwatch is a polish slice.
- **Mobile entry app** — web-responsive works but no native iOS / Android.
- **Approval workflow** — partner sign-off on team time. Not in v1 (small firms self-manage).
