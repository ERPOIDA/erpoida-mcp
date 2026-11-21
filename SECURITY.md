# Security

## Reporting a vulnerability

Please report security issues privately to <hello@erpoida.com> with "Security" in the subject.
Do not open a public GitHub issue for a vulnerability.

Include what you found, how to reproduce it, and the impact you expect. Test only against your
own account and workspace, and do not access, modify or delete other people's data.

## If a token leaks

1. Revoke it in ERPoida: **Settings → Access tokens**.
2. Check the workspace action log for calls you do not recognise.
3. Create a new token and update the places that used the old one.

If you committed a token to a repository, revoking it is the fix. Rewriting git history alone
does not make an exposed token safe.

## This repository

This repo contains documentation, example configs and Agent Skills only. It must never contain
real tokens, passwords, customer data or workspace identifiers. Example configs reference
environment variables such as `ERPOIDA_TOKEN` instead of literal values.
