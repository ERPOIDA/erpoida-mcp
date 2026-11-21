# Authentication

ERPoida's MCP endpoint accepts a bearer token. You get one of two ways, and both behave the
same once issued: the token names you and one workspace, and every call runs with your
**current** role in that workspace.

## OAuth (recommended for people)

The server advertises standard discovery documents, so clients configure themselves:

| Document | URL |
| --- | --- |
| Protected resource metadata | `https://app.erpoida.com/.well-known/oauth-protected-resource/api/mcp/server` |
| Authorization server metadata | `https://app.erpoida.com/.well-known/oauth-authorization-server` |

- Authorization code flow with **PKCE (S256)**.
- **Dynamic client registration**, so there is no client ID to request.
- An ERPoida consent screen where you choose **one workspace** and approve.
- No refresh tokens and no separate OAuth scopes. The grant lasts until it is revoked, and the
  permissions are whatever your role allows at the time of each call.

An unauthenticated request receives `401` with a `WWW-Authenticate: Bearer resource_metadata=...`
header, which is how MCP clients know to start the flow.

## Personal access tokens (for scripts, CI and headless agents)

1. In ERPoida open **Settings → Access tokens** (user menu → Account).
2. Create a token, give it a recognisable name (for example `Cursor on laptop`) and pick the
   workspace. Expiry is optional.
3. Copy the token. **It is shown once.** Tokens start with `erpoida_pat_`.
4. Store it in a secret manager or an environment variable, and send it as:

```
Authorization: Bearer erpoida_pat_...
```

A PAT also works against ERPoida's REST API, so the same credential can drive scripts beyond MCP.

## What a token can and cannot do

- It can never do more than the person who issued it. There is no separate permission set on
  the token.
- It is bound to exactly one workspace. To work in another workspace, connect again or create
  another token.
- If you lose access to that workspace, or your account is deactivated, the token stops working
  on its next call.
- Only a hash of the token is stored by ERPoida.

## Revoking access

- **ERPoida:** Settings → Access tokens → revoke. Takes effect on the next request. OAuth
  connections appear in the same list.
- **Client side:** remove the connector in Claude, ChatGPT or your IDE config. This does not
  invalidate the token in ERPoida, so revoke it there too if it may have been exposed.

The **Last used** column in Settings → Access tokens makes stale tokens easy to spot.

## Handling tokens safely

- Do not paste a token into a chat with an assistant.
- Do not commit tokens. Commit config files that reference an environment variable
  (see [`examples/`](../examples/)), and keep `.env` files out of git.
- Prefer one token per device or integration, so you can revoke one without breaking others.
- Set an expiry for tokens used in short-lived experiments.
- Always use HTTPS. A bearer token over plain HTTP is a password in cleartext.
