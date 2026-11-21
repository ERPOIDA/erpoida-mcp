# Troubleshooting

**Sign-in window does not open**
Check the full server URL (`https://app.erpoida.com/api/mcp/server`), and that your Claude or
ChatGPT admin allows custom connectors. In an IDE, look for a Login / Authenticate action on
the server in the client's MCP panel.

**401 Unauthorized**
The token is missing, expired or revoked, or you no longer have access to the workspace it is
bound to. Reconnect with OAuth, or create a new token in Settings → Access tokens. With a PAT,
check that the header is exactly `Authorization: Bearer erpoida_pat_...` and that your
environment variable is actually set in the process that launches the client (IDEs started
from a desktop shortcut often do not see variables from your shell profile).

**403 "Origin is not allowed"**
The request came from a browser page on an origin ERPoida does not allow. Call from a desktop
client, CLI or server instead.

**"Access is denied" or "You don't have ... access to ..."**
Your role in that workspace does not allow the action. Ask a workspace admin, or check that
you authorized the workspace you meant. Verify your email address if you have not.

**A tool or object is missing**
Its module is not enabled in the workspace, or your role cannot see it. Call
`describe_metadata` to see what this connection can reach.

**"No single active workspace"**
The token is not bound to one workspace. Create a token for a specific workspace, or
reconnect with OAuth and pick one.

**A write fails with a field error**
Use the field named in the message. Run `describe_metadata` to check the exact field name,
type and select options. Posted invoices and journal entries are locked; correct them by
reversal or through the source document, as in the app.

**Rate limit message**
Wait the time stated in the message, then continue. Reduce call volume with filters and larger
page sizes.

**Still stuck?**
Email <hello@erpoida.com> with the client you use, the time of the problem and the exact error
message. Do not include your token.
