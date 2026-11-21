// Shared connection helper for the examples.
// Reads the token from ERPOIDA_TOKEN so it never lives in source.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const DEFAULT_URL = 'https://app.erpoida.com/api/mcp/server';

export async function connect() {
  const token = process.env.ERPOIDA_TOKEN;
  if (!token) {
    console.error('Set ERPOIDA_TOKEN to a personal access token (ERPoida → Settings → Access tokens).');
    process.exit(1);
  }

  const url = new URL(process.env.ERPOIDA_MCP_URL ?? DEFAULT_URL);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    console.error(`Refusing to send a bearer token over ${url.protocol} to ${url.host}. Use HTTPS.`);
    process.exit(1);
  }

  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
  const client = new Client({ name: 'erpoida-mcp-example', version: '1.0.0' });
  try {
    await client.connect(transport);
  } catch (err) {
    // StreamableHTTPError carries the HTTP status as `code`.
    if (err?.code === 401) {
      console.error('401 Unauthorized: the token is invalid, expired or revoked, or its workspace is no longer accessible.');
    } else {
      console.error(`Could not connect to ${url.origin}: ${err?.message ?? err}`);
    }
    process.exit(1);
  }
  return client;
}

/** Text of the first content block, parsed as JSON when possible. */
export function resultBody(result) {
  const text = result.content?.find((c) => c.type === 'text')?.text ?? '';
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
