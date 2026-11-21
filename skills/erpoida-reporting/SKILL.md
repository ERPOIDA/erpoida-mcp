---
name: erpoida-reporting
description: Answer quantitative questions about ERPoida data and build charts and dashboards through the erpoida MCP server. Use when the user asks how many, how much, totals, averages, trends over time, breakdowns by stage, owner or month, or wants a chart, KPI or dashboard in ERPoida.
---

# ERPoida: reporting, charts and dashboards

## Answer numbers with `aggregate_records`

Do not page through records to count or sum them. `aggregate_records` computes it server-side:

```json
{
  "objectKey": "crm.deal",
  "groupBy": "stage",
  "aggregate": "sum",
  "measureField": "amount",
  "filters": [{ "field": "closeDate", "op": "gte", "value": "2026-01-01" }]
}
```

- `aggregate`: `count sum avg min max count_distinct`.
- `groupBy` can be one relation hop, for example `company.industry`.
- `dateBucket` groups a date field by period; labels come back as ISO (`2026-03`, `2026-Q1`,
  `2026-W05`).
- `columnGroupBy` gives a second dimension (pivot).
- `measures` lets you return several series at once (for example won count and total count).
- Field names come from `describe_metadata`.

Measures come back as exact decimal strings. Keep them exact in tables; round only in prose,
and say so.

Always state the object, filters and period behind a number.

## Saved charts and dashboards

| Step | Tool |
| --- | --- |
| See what exists | `list_dashboards`, `get_dashboard`, `list_charts` |
| Read a chart's numbers | `get_chart_data { dashboardId, chartId, filterValues? }` |
| New dashboard | `create_dashboard` (private until shared) |
| Add a chart | `create_chart { dashboardId, title, objectKey, type, ... }` with `type` `chart`, `kpi` or `pivot` |
| Change | `update_chart` (only passed params change; `clear` removes settings), `update_dashboard` |
| Share | `share_dashboard` replaces the share list: workspace, role or user |
| Remove | `delete_chart` |

Chart types for `type: "chart"`: bar, column, stacked_bar, line, area, combo, pie, donut,
funnel, gauge.

Workflow for "build me a dashboard":

1. Clarify the questions it should answer (3 to 6 charts is usually enough).
2. Prototype each with `aggregate_records` and show the numbers.
3. Create the dashboard and charts once the user is happy.
4. Ask before sharing, and with whom. `share_dashboard` **replaces** existing shares.

## Example prompts

- "Pipeline value by stage for deals closing this quarter."
- "Invoices issued per month this year, with totals."
- "Build a sales dashboard with pipeline by stage, won deals per month and top 10 customers."
