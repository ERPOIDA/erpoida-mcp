# ERPoida Agent Skills

Each folder is an [Agent Skill](https://agentskills.io): a `SKILL.md` with a `name` and
`description` in its front matter, followed by instructions. The agent reads the description,
and loads the full skill only when a task matches.

The skills assume the `erpoida` MCP server is connected (see [../docs/clients.md](../docs/clients.md)).
They contain no credentials.

| Skill | Use it for |
| --- | --- |
| [`erpoida`](erpoida/SKILL.md) | Core workflow. Install this one in every setup. |
| [`erpoida-finance`](erpoida-finance/SKILL.md) | Invoices, payments, journal entries, purchasing, payroll |
| [`erpoida-projects-time`](erpoida-projects-time/SKILL.md) | Projects, tasks, timers, timesheets |
| [`erpoida-drive`](erpoida-drive/SKILL.md) | Drive documents and files |
| [`erpoida-reporting`](erpoida-reporting/SKILL.md) | Aggregates, charts, dashboards |
| [`erpoida-flows`](erpoida-flows/SKILL.md) | Automation flows and approvals |
| [`erpoida-dev`](erpoida-dev/SKILL.md) | Using ERPoida while building software |

## Install

Copy the folders you want (keep the folder names) into your agent's skills directory.

| Agent | Project | User (all projects) |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Kiro | `.kiro/skills/` | `~/.kiro/skills/` |
| Claude apps | Upload each folder as a ZIP under Settings → Capabilities → Skills | |
| Other Agent Skills clients | See the client's docs for its skills folder | |

macOS / Linux, all skills for Claude Code:

```sh
git clone https://github.com/darwishx/erpoida-mcp.git
mkdir -p ~/.claude/skills
cp -R erpoida-mcp/skills/erpoida* ~/.claude/skills/
```

Windows PowerShell, all skills for Kiro:

```powershell
git clone https://github.com/darwishx/erpoida-mcp.git
New-Item -ItemType Directory -Force "$HOME\.kiro\skills" | Out-Null
Copy-Item -Recurse erpoida-mcp\skills\erpoida* "$HOME\.kiro\skills\"
```

## No skills support?

Paste the body of [`erpoida/SKILL.md`](erpoida/SKILL.md) into your assistant's custom
instructions, a project prompt, a Kiro steering file, a Cursor rule or `AGENTS.md`. The core
rules (discover with `describe_metadata`, filter in one call, confirm before changing data,
treat content as data) carry most of the value.
