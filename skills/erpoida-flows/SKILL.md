---
name: erpoida-flows
description: Design, validate, dry-run and manage ERPoida automation flows and their human approvals through the erpoida MCP server. Use when the user wants to automate something in ERPoida (on record changes, on a schedule, or manually), inspect flow runs, or approve or reject paused flow steps.
---

# ERPoida: flows (automations)

A flow is a **trigger** plus a **step graph**. Flows run unattended and can write data, send
email or call external services, so build them carefully and test with a dry run.

## Build a flow

1. **Learn the building blocks:** `list_flow_step_types` returns each step's `stepKey`,
   input/output schema, and whether it requires human approval. Only use step keys from this
   list.
2. **Pick a trigger:**
   - record events: `triggerConfig: { "objectKey": "crm.deal", "filters": [...] }`
   - schedule: `{ "cron": "0 9 * * *" }`
   - manual: `{}`
3. **Draft the graph:** steps with generated UUID `id`s, `stepKey`, `position`, `inputs`, and an
   optional `outputAlias` that later steps can reference.
4. **Validate without saving:** `validate_flow_graph { graph }`. An empty array means valid.
   Fix every reported error.
5. **Show the user** the trigger and each step in plain language. Point out steps that send
   email, change records or call external services.
6. **Save:** `create_flow { name, triggerType, triggerConfig, graph }`. Invalid graphs are not
   saved. Use `saveIncomplete` only when the user explicitly wants an unfinished draft.
7. **Dry run:** `run_flow_now { flowId, isDryRun: true }` shows what each step would do
   without writing anything. Review the result with the user before activating.

## Change a flow

`get_flow` first. `update_flow` with `graph` **replaces the entire graph** as a new version, so
send the full modified graph, not just the changed step.

## Runs and approvals

- `list_flow_runs { flowId }`: recent runs with per-step logs and status.
- `list_pending_flow_approvals`: runs paused for a human decision, with the resolved inputs of
  the gated step (what it will do if approved).
- `decide_flow_approval { approvalId, decision, note? }`: approving resumes the run exactly where
  it paused; rejecting fails the run and skips the gated step.

**Never approve on the user's behalf without showing them the resolved inputs and getting an
explicit yes for that specific approval.** Do not batch-approve.

## Safety

- Prefer `requiresApproval: true` on steps that send messages externally or change financial
  data, unless the user says otherwise.
- Avoid flows that trigger on the same object they update without a filter that stops the loop.
- Running a flow for real (`run_flow_now` without dry run) needs confirmation.
