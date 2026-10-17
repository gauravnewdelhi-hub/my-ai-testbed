# AI Agent Testbed

A zero-dependency, static demonstration platform for testing four deterministic
agent simulations through a reusable, accessible browser widget. It includes
the preserved Northstar Home Services page, a fictional shop, a fictional legal
portal, and an agent test console. No real model API, database, payment service,
booking, dispatch, or customer-data collection is implemented.

## Quick start

Prerequisites: Node.js 20 or newer and npm 10 or newer. No API keys or paid
services are needed.

```sh
npm install
npm run dev:home
```

Open the local URL printed in the terminal. The home page is at `/`; the other
apps are available through `npm run dev:store`, `npm run dev:legal`, and
`npm run dev:console` in separate terminals (or stop one before starting
another, since each uses a different port).

```sh
npm run build       # build all four independent static outputs
npm test            # Node's built-in test runner
npm run test:check  # unified build, tests, and production artifact checks
```

There are no third-party runtime or development dependencies. `package-lock.json`
is committed to make npm workspace installation reproducible.

## Applications

| App | Local development command | Build output |
| --- | --- | --- |
| Agent Test Console | `npm run dev:console` | `apps/widget-harness/dist/` |
| Fictional e-commerce store | `npm run dev:store` | `apps/ecom-store/dist/` |
| Fictional legal portal | `npm run dev:legal` | `apps/legal-portal/dist/` |
| Northstar Home Services | `npm run dev:home` | `apps/home-services/dist/` |

The source-of-truth registry and site assignments are in
[`packages/agent-registry/registry.js`](./packages/agent-registry/registry.js).
The browser widget is in [`packages/agent-sdk/widget.js`](./packages/agent-sdk/widget.js).
The SDK uses Shadow DOM, local deterministic responses, and no network service.
It is a demo, not an authenticated production agent service.
The deployed `/external-chat-test.html` route is a clean, separate-origin host
page for manual embed compatibility checks; it intentionally has no built-in
widget.

## Layout

```text
apps/
  ecom-store/          Fictional product catalogue and local cart
  home-services/       Build target for the existing root Northstar page
  legal-portal/        Fictional law firm and non-advisory intake demo
  widget-harness/      Agent catalog, preview, snippet generator, test page
packages/
  agent-registry/      Agent/site configuration and deterministic runtime
  agent-sdk/           Browser-loadable embeddable widget
scripts/               Static app builder and local development server
docs/                  Architecture, deployment, safety and maintenance guides
index.html             Preserved Northstar home-services page
```

## Setup and configuration

Ordinary agent and site changes are made in
[`packages/agent-registry/registry.js`](./packages/agent-registry/registry.js).
Responses and the shared browser widget are in the respective packages above.
The build optionally reads `PUBLIC_WIDGET_URL` to enable copying production
installation snippets. Leave it unset until a stable public HTTPS widget URL
has actually been deployed. See [`.env.example`](./.env.example).
For local use, copy `.env.example` to `.env` and fill in that value only after
confirming the production URL; Vercel reads the same variable from its project
environment settings.

The dashboard is read-only: it does not save configuration, create sites, or
change agent availability in the browser. Registry edits take effect after
rebuilding and redeploying.

## Deployment and documentation

No production deployment URL or Vercel project settings were available to
verify from this workspace. Do not use a preview URL or invent a widget URL.
Build and then follow the manual Vercel setup in
[`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md).

- [Architecture](./docs/ARCHITECTURE.md)
- [Agent catalog](./docs/AGENT_CATALOG.md)
- [Add, change, disable, or remove agents](./docs/ADD_REMOVE_CHANGE_AGENTS.md)
- [Widget installation](./docs/INSTALLATION_GUIDE.md)
- [Deployment and rollback](./docs/DEPLOYMENT_GUIDE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Security and privacy](./docs/SECURITY.md)
- [Test plan and current verification](./docs/TEST_PLAN.md)

## Important demo boundaries

- Every registered agent is marked **SIMULATED**. The agents do not call an
  LLM, backend, CRM, email provider, calendar, or voice service.
- Never enter real personal, legal, financial, health, or account information.
- The shop cart is held in the browser only; there is no checkout or payment.
- Legal content is general fictional information, not legal advice.
- Home-service inquiries and emergencies do not book, dispatch, or call anyone.
- The public site ID identifies configuration; it is not a credential or access
  control.
