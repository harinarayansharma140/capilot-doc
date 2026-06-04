---
title: Compliance calendar
---

# Compliance calendar

Spatial sense of where the firm's deadlines cluster. The dashboard "Next 5 weeks" tile and the full month-view page (`/practice/compliance-calendar`) share the same data — the calendar is just a different rendering of the same `ComplianceTask` table.

![Compliance calendar](/img/screens/11-compliance-calendar.png)

## What's working

- **Month grid** with the current week highlighted.
- **Compliance task chips** dropped on their due date, colour-coded by Status + Alert state:
  - Red outline = active alert (the cron has flagged this task as approaching/missed)
  - Solid fill = task status (gold open, blue in-progress, green done)
- Click a chip → opens the task form in a modal.
- Top filter strip: AssignedTo, ServiceCode, Priority, Status.
- "Today" button + month nav (◀ ▶).
- "View as list" toggle returns to the task grid with filters preserved.

## What's stub / pending

- **Week view** — month view only today; week view is a small UI add.
- **Print-friendly month sheet** — for offline firm noticeboards.
