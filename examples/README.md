# Examples

Client configs that authenticate with a **personal access token** read from the
`ERPOIDA_TOKEN` environment variable. For OAuth, remove the `headers` block (or the
`bearer_token_env_var` line for Codex) and sign in when the client asks.

| Client | File | Where it goes |
| --- | --- | --- |
| Claude Code | [`claude-code/.mcp.json`](claude-code/.mcp.json) | Project root |
| Cursor | [`cursor/mcp.json`](cursor/mcp.json) | `~/.cursor/mcp.json` or `.cursor/mcp.json` |
| VS Code | [`vscode/mcp.json`](vscode/mcp.json) | `.vscode/mcp.json` (prompts for the token, no env var needed) |
| Kiro | [`kiro/mcp.json`](kiro/mcp.json) | `~/.kiro/settings/mcp.json` or `.kiro/settings/mcp.json` |
| Windsurf | [`windsurf/mcp_config.json`](windsurf/mcp_config.json) | `~/.codeium/windsurf/mcp_config.json` |
| Codex | [`codex/config.toml`](codex/config.toml) | `~/.codex/config.toml` |
| Gemini CLI | [`gemini/settings.json`](gemini/settings.json) | `~/.gemini/settings.json` or `.gemini/settings.json` |
| Node.js | [`node/`](node/) | Minimal SDK client: `list-tools.mjs`, `call-tool.mjs` |

Set the variable before launching the client:

```sh
# macOS / Linux
export ERPOIDA_TOKEN=erpoida_pat_...
```

```powershell
# Windows PowerShell (current session)
$env:ERPOIDA_TOKEN = "erpoida_pat_..."
```

If you already have an `mcpServers` block, merge the `erpoida` entry into it rather than
replacing the file. Never commit a file with the token pasted in.
