---
title: Compliance tasks
---

# Compliance tasks

Every recurring filing — GSTR-1 / 3B / 9, ITR, Tax Audit, TDS, ROC, labour returns, ICAI peer reviews — pre-generated 12 months ahead from each client's service subscriptions.

![Compliance tasks](/img/screens/12-compliance-tasks.png)

## What's working

- **Pre-generation engine** materialises tasks for the next 12 months based on each client's `ClientService` × `ServiceFrequency` × due-date formula. Daily cron tops up the rolling window.
- **State machine**: Open → InProgress → OnHold → Done → Filed → Cancelled → NA.
- **Filters**: due-date range, status, priority, assignee, service code, client.
- **Bulk update** — multi-select rows, set Status / Priority / AssignedTo in one click. KPI tiles up top: Overdue / Due-this-week / In-progress / Done-this-month.
- **DueDate colour coding** — red overdue, orange this week, gold this month, gray done.
- **Drill-in** from the dashboard's "Compliance pulse" tiles lands on filtered lists.

## What's stub / pending

- **Auto-create from filing** — when a CA marks a task `Filed`, we don't yet stamp an ARN / acknowledgment number. Minor add.
- **Bulk reassign across staff** — needs a polish slice.
