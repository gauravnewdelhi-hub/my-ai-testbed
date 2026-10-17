# Security and privacy

## Implemented in this static demo

- No API keys, credentials, server endpoints, or provider integrations are
  included.
- Widget configuration is validated against a static registry: site and agent
  must exist, be enabled, and be compatible.
- Widget message text is inserted using `textContent`; host-site styles are
  isolated in a Shadow DOM.
- Messages are limited to 1,000 characters and held only in page memory. They
  are not transmitted, logged, saved in cookies, or persisted across refresh.
- No analytics, visitor IDs, third-party cookies, storage, forms sent to a
  server, or side effects are implemented.
- `vercel.json` adds cross-origin headers only for public static modules under
  `/packages/`, which need to support cross-origin ESM imports.
- Build configuration refuses an explicitly configured non-HTTPS or localhost
  public widget URL.

## Limits (not production controls)

All browser assets, registry details, identifiers, appearance settings, and
simulation logic are public. Site IDs are not secrets and do not authenticate
or authorize a website. Anyone can copy or alter the JavaScript and call local
browser code. There is no authentication, tenant isolation, server-side
validation, abuse/rate limiting, request-size enforcement at an API, provider
timeout, or private configuration store because there is no API. Do not
interpret the static demo as a production security boundary.

## Privacy and sensitive information

Prominent demo notices tell visitors not to submit real personal, legal,
financial, health, or confidential information. The fictional legal assistant
does not advise or create a lawyer-client relationship. The home-services
site does not handle real emergencies, dispatch, or appointment booking. The
store does not accept payments or create orders. Do not add real names,
customer records, API keys, or confidential test data to public files.

## Before integrating a real AI service

Create a server-side adapter with fixed provider endpoints; never use this
widget as an unrestricted proxy. Keep keys in provider-side environment
variables. Validate site/agent/request bodies, limit body size and message
length, restrict origins where practical, apply abuse controls, use explicit
timeouts, and report provider failures honestly. Establish retention and
consent notices, disclosure, cost/usage limits, rate limiting, monitoring that
avoids conversation content, and human escalation appropriate to the domain.
Do not silently substitute simulated responses when the provider fails.

The widget's public cross-origin headers are intended only for static JS module
files. Do not attach them to a future privileged API without separately
designing its authorization and CORS rules.
