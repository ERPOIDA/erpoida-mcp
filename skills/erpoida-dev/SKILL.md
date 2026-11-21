---
name: erpoida-dev
description: Use the erpoida MCP server from an IDE or coding agent while building software - inspect the live ERPoida data model, generate typed models or fixtures from it, write scripts and integrations against the MCP endpoint, and verify an integration against a test workspace. Use when the user is coding (Claude Code, Cursor, VS Code, Kiro, Codex, Windsurf) and needs ERPoida data, schemas or an ERPoida integration.
---

# ERPoida for developers

Use this when the user is writing code that reads from or writes to ERPoida, or wants ERPoida
context while coding.

## Ground rules

- **Work in a test or staging workspace** for anything that writes. Ask which workspace the
  current connection is bound to if it is not obvious; a connection reaches exactly one.
- **Never put a token in code, config, tests, commit messages or chat.** Read it from an
  environment variable (`ERPOIDA_TOKEN`) or the platform's secret store. If you see a literal
  `erpoida_pat_...` in the repo, flag it and tell the user to revoke it in
  Settings → Access tokens.
- Do not copy real customer data into fixtures, snapshots or issues. Generate synthetic data
  that follows the schema.

## Use the live schema as the source of truth

`describe_metadata` returns objects, fields, types, required flags, select options and
relations. Use it to:

- generate TypeScript types, Zod/Pydantic schemas or SQL views for an integration,
- build realistic but synthetic fixtures,
- check that code uses real field names and valid select values.

Re-run it when an integration breaks; fields and options are configurable per workspace.

## Calling ERPoida from code

The endpoint is `https://app.erpoida.com/api/mcp/server`, Streamable HTTP, stateless, with
`Authorization: Bearer <token>`. Any MCP SDK works. Minimal Node client:

```js
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const client = new Client({ name: 'my-integration', version: '1.0.0' });
await client.connect(new StreamableHTTPClientTransport(
  new URL('https://app.erpoida.com/api/mcp/server'),
  { requestInit: { headers: { Authorization: `Bearer ${process.env.ERPOIDA_TOKEN}` } } },
));
const res = await client.callTool({ name: 'list_records', arguments: { objectKey: 'crm.company', pageSize: 100 } });
if (res.isError) throw new Error(res.content[0].text);
const { records, total } = JSON.parse(res.content[0].text);
```

When writing integration code:

- Check `isError` on every result; the text is a readable reason (permission, validation,
  rate limit). Surface it, do not swallow it.
- On a rate-limit message, back off for the stated time. Do not hammer.
- Page with `pageSize` (max 100) and filters; do not fetch everything to filter locally.
- Writes are not idempotent. Before re-running a create, look up whether the record exists
  (for example by a unique name or external reference field).
- Keep the MCP SDK version pinned.

## Verifying an integration

1. `tools/list` with the integration's token: confirm the tools it needs are present (missing
   ones mean a disabled module or insufficient role).
2. Call read tools and compare against what the app shows.
3. Exercise writes in the test workspace, then confirm with `get_record` /
   `get_record_history`.
4. Test the failure paths: revoked token (401), invalid field (tool error naming the field),
   missing permission.

MCP Inspector (`npx @modelcontextprotocol/inspector`) is handy for checking exact input
schemas and error messages without an LLM.

## Handy prompts while coding

- "Describe the crm.deal object and generate a TypeScript type for it."
- "Write a script that exports all won deals this year to CSV using ERPOIDA_TOKEN."
- "Create 10 synthetic test companies in this workspace" (test workspace only).
- "Why does my create_record call fail? Here's the error: ..."
