# Maintain the agent catalog

These instructions refer to the current implementation. The catalog is
version-controlled and read-only in the browser. Changes are reviewed and
published through Git; there is no web admin editor or persistent database.

## Add an agent

1. Open this GitHub repository in Codespaces or browser-based VS Code.
2. Open `packages/agent-registry/registry.js` and duplicate an agent object.
   Give it a unique lowercase, hyphen-separated ID such as `my-new-demo`.
3. Set its display name, description, category, version, capabilities, and
   `supportedSites`. Set `runtime: "simulation"` and `simulation: true` until
   a separately reviewed runtime is implemented. Provide an honest welcome
   message and one of the supported themes (`green`, `blue`, `navy`, `slate`).
4. Add the ID to each selected site's `allowedAgentIds`, and to that agent's
   `supportedSites`. Use only an existing site ID unless you are also adding a
   complete new site entry.
5. Add any contextual deterministic responses to
   `packages/agent-registry/simulation.js`. Do not promise actions that are not
   implemented. Include safety language where the domain needs it.
6. In the terminal, run `npm install`, `npm test`, and `npm run build`.
   Registry validation checks unique IDs, defaults, and site assignments.
7. Review the change in Source Control, commit it, and push through the Git UI.
   After the deployment completes, open `/console/` and verify the new entry
   and preview. The console has no real deployment state unless the public
   site is rebuilt.

## Change an agent

Edit the agent object in `packages/agent-registry/registry.js`.

- **Name, description, category, capabilities:** metadata-only.
- **Welcome message and default appearance:** edit `configuration`.
- **Site compatibility:** update both `supportedSites` and the corresponding
  site's `allowedAgentIds`.
- **Enabled status:** change `enabled`. Disabled agents fail configuration
  resolution and cannot generate a running widget snippet.
- **Version:** increment `version` for published behavior or material metadata
  changes so owners can identify releases.
- **Runtime:** current supported runtime is only `simulation`. A real provider
  requires a server implementation and security review; changing a string in
  the registry does not add a provider.
- **Behavior:** update and test `packages/agent-registry/simulation.js`.

Run `npm test`, `npm run build`, and `npm run test:check`, inspect the diff, and
commit/push the reviewed change. Redeploy for any registry, simulator, or
widget source change.

## Disable an agent

Set `enabled: false` on the agent. Also consider updating the site's
`defaultAgentId` and `allowedAgentIds` if that agent should no longer be
offered as an installation choice. Keep the source implementation and tests.
Build and redeploy. The widget resolves the shipped registry before mounting,
so a disabled ID does not launch. Previously copied snippets fail closed after
the updated site/widget files are served; a visitor with a cached old artifact
may temporarily see old behavior until cache refresh.

## Remove an agent

First check whether any site uses it as a default or allowed ID. Replace those
assignments, then remove the agent record and its dedicated simulation
responses/tests/documentation. Keep the shared widget, simulator, registry
helpers, and other agents. Run `npm test` and `npm run test:check` before
committing. Old snippets referring to a removed ID fail closed with an
unknown/disabled configuration error; remove the script from sites you control.

## Roll back

Use the Git UI to revert the specific reviewed registry/code change, then
rebuild and redeploy the known-good commit. In Vercel, use the deployment
history to promote a verified previous production deployment if it is still
available. Do not roll back by deleting other people's changes or resetting
the branch. Published versions can be cache-stale for up to the configured
static cache window; the widget uses short shared-package caching.
