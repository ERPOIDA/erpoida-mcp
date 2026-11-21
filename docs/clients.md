# Connecting clients

Server URL for every client:

```
https://app.erpoida.com/api/mcp/server
```

Two ways to authenticate (details in [authentication.md](authentication.md)):

- **OAuth (recommended).** The client opens an ERPoida sign-in window, you pick one workspace
  and approve. Nothing to copy or store yourself.
- **Personal access token (PAT).** Create one in ERPoida under **Settings → Access tokens**
  and send it as `Authorization: Bearer <token>`. Use this for headless agents, CI, or a client
  that cannot complete OAuth.

When you use a PAT in a config file, keep the token in an environment variable such as
`ERPOIDA_TOKEN` and reference the variable. Never commit the token itself.

Client menus and config formats change between releases. If a step or key looks different,
check that client's MCP documentation.

---

## Claude (claude.ai, Desktop, mobile)

Requires a Pro, Max, Team or Enterprise plan.

1. **Pro or Max:** open **Settings → Connectors → Add custom connector**.
   **Team or Enterprise:** an Owner adds it once under **Organization settings → Connectors**;
   members then connect it from **Settings → Connectors**.
2. Name it `ERPoida`, paste the server URL, select **Add**.
3. Select **Connect**, sign in to ERPoida and approve one workspace.
4. In a chat, open **+ → Connectors** and switch ERPoida on.

Once added on the web it is available in Claude Desktop and the mobile apps too.

To use the [skills](../skills/README.md) in Claude apps, upload a skill folder as a ZIP under
**Settings → Capabilities → Skills** (plan and admin settings permitting).

## ChatGPT

Requires a plan with developer mode for MCP apps (for example Plus, Pro, Business, Enterprise).

1. **Business or Enterprise:** a workspace admin first allows custom MCP connectors under
   **Workspace settings → Permissions & roles**.
2. Open **Settings → Apps → Advanced settings** and turn on **developer mode**.
3. Select **Create app**, name it `ERPoida`, paste the server URL, choose **OAuth**.
4. Sign in to ERPoida and approve one workspace.
5. In a chat, pick ERPoida from the tools menu.

## Claude Code

```sh
# OAuth: add, then run /mcp in Claude Code and choose Authenticate
claude mcp add --transport http erpoida https://app.erpoida.com/api/mcp/server

# Or with a PAT from the environment
claude mcp add --transport http erpoida https://app.erpoida.com/api/mcp/server \
  --header "Authorization: Bearer $ERPOIDA_TOKEN"
```

Add `--scope project` to write a shareable `.mcp.json` into the repo, or `--scope user` to make
it available in every project. A project file that expands the variable at runtime:
[`examples/claude-code/.mcp.json`](../examples/claude-code/.mcp.json).

Skills: copy folders from [`skills/`](../skills/) into `.claude/skills/` (project) or
`~/.claude/skills/` (user).

## Cursor

Global: `~/.cursor/mcp.json`. Per project: `.cursor/mcp.json`.

```json
{
  "mcpServers": {
    "erpoida": {
      "url": "https://app.erpoida.com/api/mcp/server"
    }
  }
}
```

Cursor shows a **Login** / **Needs authentication** action for the server in
**Settings → MCP**; use it to run OAuth. PAT variant:
[`examples/cursor/mcp.json`](../examples/cursor/mcp.json).

## VS Code (GitHub Copilot agent mode)

Per project: `.vscode/mcp.json`. Or run **MCP: Add Server** from the command palette.

```json
{
  "servers": {
    "erpoida": {
      "type": "http",
      "url": "https://app.erpoida.com/api/mcp/server"
    }
  }
}
```

VS Code prompts you to sign in on first use. For a PAT, VS Code can prompt for the token once
and store it securely instead of keeping it in the file:
[`examples/vscode/mcp.json`](../examples/vscode/mcp.json).

## Kiro

Per workspace: `.kiro/settings/mcp.json`. For all workspaces: `~/.kiro/settings/mcp.json`.

```json
{
  "mcpServers": {
    "erpoida": {
      "url": "https://app.erpoida.com/api/mcp/server"
    }
  }
}
```

Kiro runs the OAuth sign-in in your browser when the server first connects. PAT variant with
`${ERPOIDA_TOKEN}` expansion: [`examples/kiro/mcp.json`](../examples/kiro/mcp.json).

Skills: copy folders from [`skills/`](../skills/) into `.kiro/skills/` (workspace) or
`~/.kiro/skills/` (global).

## Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "erpoida": {
      "serverUrl": "https://app.erpoida.com/api/mcp/server"
    }
  }
}
```

If Windsurf does not start an OAuth sign-in, use the PAT variant:
[`examples/windsurf/mcp_config.json`](../examples/windsurf/mcp_config.json).

## OpenAI Codex (CLI and IDE extension)

```sh
# OAuth
codex mcp add erpoida --url https://app.erpoida.com/api/mcp/server
codex mcp login erpoida
```

Or edit `~/.codex/config.toml` to read a PAT from the environment:
[`examples/codex/config.toml`](../examples/codex/config.toml). The CLI and the IDE extension
share this file.

## Gemini CLI

`~/.gemini/settings.json` (or `.gemini/settings.json` in a project):

```json
{
  "mcpServers": {
    "erpoida": {
      "httpUrl": "https://app.erpoida.com/api/mcp/server"
    }
  }
}
```

Run `/mcp auth erpoida` to sign in. PAT variant:
[`examples/gemini/settings.json`](../examples/gemini/settings.json).

## Any other client

Anything that speaks MCP over Streamable HTTP works. Point it at the server URL. If it supports
OAuth discovery it will find the authorization server through
`https://app.erpoida.com/.well-known/oauth-protected-resource/api/mcp/server`. Otherwise send a
PAT in the `Authorization` header.

Browser-based clients must run on an origin ERPoida allows; requests carrying any other
`Origin` header are rejected. Desktop apps, CLIs and servers do not send one and are not
affected.

## Check the connection

Ask the assistant:

> Call describe_metadata and tell me which objects exist in my ERPoida workspace.

If that works, try [the example prompts](../skills/erpoida/SKILL.md#example-prompts).
Problems: [troubleshooting.md](troubleshooting.md).
