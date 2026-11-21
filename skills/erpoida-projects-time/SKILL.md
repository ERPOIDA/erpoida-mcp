---
name: erpoida-projects-time
description: Manage ERPoida projects, tasks, timers and timesheets through the erpoida MCP server. Use when the user wants to see or organize tasks, plan work, create tasks from notes or meeting minutes, start or stop a timer, log hours, or review time spent in ERPoida.
---

# ERPoida: projects and time

Projects and tasks are ordinary records. Use the generic record tools from the `erpoida`
skill, and the time-tracking tools for timers and timesheets.

## Find the right objects first

Call `describe_metadata` and look for the project and task objects (typically keys like
`projects.project` and `projects.task`). Note:

- the task's relation field to its project,
- the exact `select(...)` options for status/stage and priority (casing matters, for example
  `In Progress` vs `in_progress`),
- assignee and due-date field names.

## Common jobs

**Open work, grouped:** one `list_records` call on tasks with a status filter
(`{"stage":{"in":[...]}}`) and the fields you need, then group in your answer. For counts per
group, use `aggregate_records` instead.

**Tasks from notes:** extract action items, show them as a list (title, assignee, due date,
priority), get confirmation, then create each with `create_record`, linking the project by id.
Report the created tasks with links.

**Move work along:** `update_record` with only the changed field. Mention the old and new value.

**Context on a task:** `get_record`, `list_record_comments`, `get_record_history`.

## Time tracking

| Tool | Notes |
| --- | --- |
| `start_timer { task?, employee?, billable? }` | Without `employee`, uses the signed-in user's linked employee. Starting stops that employee's other running timer, so mention it. |
| `pause_timer` / `resume_timer` | Pause closes the current segment; resume opens a new one on the same entry. |
| `stop_timer` | Writes total tracked hours onto the entry. |
| `create_timesheet_entry { values }` | Log finished time directly. `employee` is required. |
| `update_timesheet_entry { id, values }` | Editing hours or start/end times recomputes segments. |

Approving or rejecting time off (`approve_time_off`, `reject_time_off`) acts on someone else's
request: confirm with the user first.

## Good habits

- Ask before assigning work to other people.
- Use the user's time zone when you state dates and times, and say which one you used.
- Do not bulk-close or bulk-reassign tasks without showing the list first.
