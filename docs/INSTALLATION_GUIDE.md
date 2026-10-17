# Widget installation guide

## Current behavior

The browser-loadable ES module is
`/packages/agent-sdk/widget.js`. It imports the shared registry and simulator
from sibling files under `/packages/agent-registry/`. It uses Shadow DOM and
only browser memory. It makes **no API request** and sends no visitor data.
All responses are deterministic simulation, not live AI.

Example shape (use only after deploying and confirming your real production
widget URL):

```html
<script type="module" async
  src="https://YOUR-STABLE-HTTPS-HOST/packages/agent-sdk/widget.js"
  data-agent-widget
  data-site-id="northstar-home-demo"
  data-agent-id="home-services-assistant-demo"></script>
```

`YOUR-STABLE-HTTPS-HOST` is a placeholder, not a working URL. The console does
not show or copy a snippet until the build has a valid `PUBLIC_WIDGET_URL`.
Use the exact value chosen for the published widget artifact; never paste a
localhost, preview deployment, invented domain, credential, or access token.

## Configuration and identifiers

Configured site IDs are `northstar-home-demo`, `ecom-store-demo`, and
`legal-portal-demo`. IDs are public selectors, not secrets or proof that a
caller owns a domain. Each agent must be enabled and explicitly allowed for
the chosen site; unknown, disabled, and incompatible configurations do not
mount the widget.

Optional attributes are `data-title`, `data-welcome`, `data-theme` (`green`,
`blue`, `navy`, or `slate`), `data-position` (`left` or `right`), and
`data-development="true"` for non-sensitive console diagnostics.
Configuration supplied in browser markup is public and may be changed by a
visitor.

## External site setup

1. Build and deploy the widget and confirm the three public ESM files load
   successfully from the final HTTPS URL:
   `packages/agent-sdk/widget.js`,
   `packages/agent-registry/registry.js`, and
   `packages/agent-registry/simulation.js`.
2. The provided Vercel config adds public CORS and cross-origin resource
   headers to `/packages/*`. Verify the actual response headers in the browser
   Network panel. For another host, configure equivalent CORS headers on the
   public static module files. No API endpoint or third-party cookie is used.
3. In the console, choose a site, compatible agent, appearance, and enabled
   status. Copy is enabled only when `PUBLIC_WIDGET_URL` is supplied as a
   production HTTPS build value. The generated widget URL does not prove that
   the host page is deployed; add the snippet to the selected host yourself.
4. Add the snippet near the end of the host page body. The host needs no npm,
   framework, build step, API key, cookie, or server-side integration.
5. Open the host over HTTPS in a private window, inspect the Network panel,
   open the launcher, send a non-sensitive test prompt, and test Escape/close.
   The chat message stays in browser memory.

## Security policy requirements on the host

The host Content Security Policy must permit scripts from the widget origin.
Check `script-src`, `script-src-elem`, and `default-src` as applicable to the
host's CSP and browser. Permit the cross-origin module files and check browser
error details. Do not disable CSP broadly. Ad
blockers or network rules may block the widget; the rest of the host page
should continue working. The widget's Shadow DOM isolates its presentation
styles, but cannot guarantee immunity to every browser extension or policy.

## Disable, remove, and troubleshoot

Remove the `<script>` element to remove the widget from one page. Disable an
agent in `packages/agent-registry/registry.js`, then rebuild and redeploy; the
static registry is not dynamically editable from the browser. See
[`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for failures, invalid identifiers,
missing configuration, and duplicate scripts.

For the independent test fixture, open `/console/test-page.html` after a
unified deployment. It intentionally includes the same module twice; the
widget must render once. This verifies the local fixture, but a separately
hosted site and production CORS behavior still require real public-link testing.
