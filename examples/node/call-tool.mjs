// Calls one tool and prints its result.
// Usage: ERPOIDA_TOKEN=erpoida_pat_... node call-tool.mjs <tool> '<json arguments>'
// Example: node call-tool.mjs list_records '{"objectKey":"crm.company","q":"Acme","pageSize":5}'
import { connect, resultBody } from './client.mjs';

const [name, rawArgs = '{}'] = process.argv.slice(2);
if (!name) {
  console.error("Usage: node call-tool.mjs <tool> '<json arguments>'");
  process.exit(1);
}

let args;
try {
  args = JSON.parse(rawArgs);
} catch {
  console.error('Arguments must be a JSON object.');
  process.exit(1);
}

const client = await connect();
try {
  const result = await client.callTool({ name, arguments: args });
  const body = resultBody(result);
  if (result.isError) {
    // Business failures (permission, validation, rate limit) arrive here with a readable reason.
    console.error(`Tool error: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
    process.exitCode = 2;
  } else {
    console.log(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
  }
} finally {
  await client.close();
}
