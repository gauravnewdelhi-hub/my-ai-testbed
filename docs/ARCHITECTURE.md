# Architecture

## Phase plan and repository baseline

The repository began as a single, plain HTML Northstar Home Services test page
with no application framework, dependencies, build tooling, Vercel config, or
test suite. The original home page remains the home-services source. The
implementation uses four reversible phases: (1) create zero-dependency npm
workspaces and a shared registry, (2) add the Shadow DOM widget and deterministic
runtime, (3) add the store, legal portal, and test console, and (4) build and
test independent outputs, document hosting, and hand off deployment steps.

## Actual source layout

- `packages/agent-registry/registry.js` is the sole source for agent metadata,
  site IDs, allowed agents, deployment paths/defaults, and snippet
  generation/validation.
- `packages/agent-registry/simulation.js` exposes the runtime contract
  `{ kind, respond({ agentId, input, history }) }` and its deterministic,
  context-sensitive implementation. It accepts short-lived in-memory
  conversation history; nothing is persisted or transmitted.
- `packages/agent-sdk/widget.js` is a browser ES module. It resolves the
  registry locally, creates a Shadow DOM widget, and calls the local simulator.
- `apps/widget-harness/public/` holds the read-only registry console and a
  standalone test page.
- `apps/ecom-store/public/` holds fictional products and an in-memory cart.
- `apps/legal-portal/public/` holds fictional practice pages and a local-only
  contact-flow demonstration.
- The root `index.html` is the preserved and extended Northstar home-services
  page. `apps/home-services/` provides its independent build target.
- `scripts/build-app.mjs` creates one independently deployable `dist/` per app.
  `scripts/build-site.mjs` assembles those outputs under `/`, `/console/`,
  `/store/`, and `/legal/` for a single Vercel static project.

## Data flow

The browser loads the widget ESM artifact and its two local ESM imports from the
same published `/packages/` path. The registry verifies that the site and
agent are known, enabled, and assigned to one another. Messages are passed to
the deterministic simulator and inserted via `textContent` into isolated DOM.
No backend, fetch, model provider, cookie, analytics, visitor identifier, or
storage is used. Public CORS response headers on `/packages/` permit loading
the ESM widget from a different origin; they do not expose a privileged API.

The console reads the same registry directly. Its preview invokes the same
simulation function; its snippet generator refuses to enable copying unless
`PUBLIC_WIDGET_URL` contains an HTTPS URL configured at build time. The console
does not persist edits.

## Build and deployment boundaries

All app sources are plain HTML, CSS, and browser JavaScript, with Node/npm used
only for local static serving, builds, and tests. There are no runtime npm
dependencies. Each workspace build copies the app and shared package sources
into `apps/<app>/dist/`. `npm run build:site` creates a unified Vercel-ready
`dist/` with the Home Services site at `/`, console at `/console/`, store at
`/store/`, legal site at `/legal/`, shared ESM modules at `/packages/`, and
guides at `/docs/`.

Separate deployments of an individual app also include their own
`/packages/agent-sdk/` and `/packages/agent-registry/` artifacts. To embed from
a different origin, serve those modules with CORS; the provided Vercel header
rule applies when this repository is deployed through Vercel. No actual host,
project linkage, domain, deployment, or CORS response has been verified in
this workspace.

## Extension points

To add a provider later, define a server-side runtime adapter and validate
requests at that server boundary. The current `simulateReply(agentId, input,
history)` function is a small deterministic example, not a security boundary
or an abstraction for secrets. Provider keys must never be added to this
registry, client files, or static output. Authentication, rate limiting,
privacy notices/consent, origin policy, usage limits, retention controls, and
provider cost safeguards need to be designed before any real service is
connected.

All demo site identifiers are public configuration identifiers, not
authorization tokens. Browser code is editable by visitors and cannot
authenticate an embedding site.
