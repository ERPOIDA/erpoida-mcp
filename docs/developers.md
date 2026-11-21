# For developers

Use the MCP endpoint directly from scripts, tests, CI jobs or your own agent.

## Protocol facts

| | |
| --- | --- |
| Endpoint | `POST https://app.erpoida.com/api/mcp/server` |
| Transport | Streamable HTTP, **stateless**: no `Mcp-Session-Id`, every request carries its own credential |
| Required headers | `Authorization: Bearer <token>`, `Content-Type: application/json`, `Accept: application/json, text/event-stream` |
| Capabilities | `tools` (`tools/list`, `tools/call`) |
| Body limit | 1 MB per request |
| File transfer | `upload_file` / `download_file` use base64, up to 10 MB per file |

Use POST for every request. There is no session to resume or tear down.

## curl

```sh
export ERPOIDA_TOKEN=erpoida_pat_...   # from Settings → Access tokens

# List tools
curl -sS https://app.erpoida.com/api/mcp/server \
  -H "Authorization: Bearer $ERPOIDA_TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Call a tool
curl -sS https://app.erpoida.com/api/mcp/server \
  -H "Authorization: Bearer $ERPOIDA_TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_records","arguments":{"objectKey":"crm.company","q":"Acme","pageSize":5}}}'
```

The response may arrive as `text/event-stream` with a single `data:` line holding the JSON-RPC
result. MCP SDKs handle both forms.

## Node.js

A complete, runnable client is in [`examples/node`](../examples/node):

```sh
cd examples/node
npm install
ERPOIDA_TOKEN=erpoida_pat_... node list-tools.mjs
ERPOIDA_TOKEN=erpoida_pat_... node call-tool.mjs list_records '{"objectKey":"crm.company","q":"Acme"}'
```

The core of it:

```js
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(
  new URL('https://app.erpoida.com/api/mcp/server'),
  { requestInit: { headers: { Authorization: `Bearer ${process.env.ERPOIDA_TOKEN}` } } },
);
const client = new Client({ name: 'my-script', version: '1.0.0' });
await client.connect(transport);

const result = await client.callTool({ name: 'describe_metadata', arguments: {} });
console.log(result.content[0].text);
await client.close();
```

## Python

```python
import asyncio, os
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    headers = {"Authorization": f"Bearer {os.environ['ERPOIDA_TOKEN']}"}
    async with streamablehttp_client("https://app.erpoida.com/api/mcp/server", headers=headers) as (r, w, _):
        async with ClientSession(r, w) as session:
            await session.initialize()
            tools = await session.list_tools()
            print([t.name for t in tools.tools])

asyncio.run(main())
```

## MCP Inspector

```sh
npx @modelcontextprotocol/inspector
```

Choose **Streamable HTTP**, enter the server URL, and either complete OAuth in the Inspector or
add an `Authorization` header with a PAT. Useful for checking a tool's exact input schema and
error messages without an LLM in the loop.

## Handling results

- Success: `content[0].text` is JSON. Parse it.
- Business failure: `isError: true`, and `content[0].text` is a human-readable reason. Do not
  retry blindly; fix the argument or permission it names.
- `401`: token missing, expired, revoked, or its workspace binding is no longer valid.
- `403` with a JSON-RPC error about Origin: you are calling from a browser on a disallowed
  origin. Call from a server instead.

## Rate limits

Every tool call is metered. When the limit is reached, the call returns `isError: true` with a
message that says how long to wait, rather than an HTTP 429. Back off for that long. Batch work
where a tool allows it (for example `list_records` with `filter` and `pageSize` up to 100,
instead of one call per record).

## Using it in CI

- Create a **dedicated token** for the pipeline, bound to a test or staging workspace, and
  store it as a CI secret (for example `ERPOIDA_TOKEN`).
- Give that account the least role it needs. The token inherits it.
- Read-only checks (`describe_metadata`, `list_records`, `get_trial_balance`) are safe to run on
  every build. Keep writes to a disposable workspace.
- Every call lands in the workspace action log, so test runs are visible to admins.

## Good citizenship

- Prefer narrow queries: filter, `fields`, and `pageSize` rather than pulling everything.
- Write tools change real business data. Use a separate workspace for experiments.
- Never log the bearer token. Redact `Authorization` headers in debug output.
