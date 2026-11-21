// Lists the tools this token can use, marking read-only ones.
// Usage: ERPOIDA_TOKEN=erpoida_pat_... node list-tools.mjs
import { connect } from './client.mjs';

const client = await connect();
try {
  const { tools } = await client.listTools();
  for (const tool of tools.sort((a, b) => a.name.localeCompare(b.name))) {
    const mode = tool.annotations?.readOnlyHint ? 'read ' : 'write';
    console.log(`${mode}  ${tool.name.padEnd(34)} ${tool.title ?? ''}`);
  }
  console.log(`\n${tools.length} tools available to this token.`);
} finally {
  await client.close();
}
