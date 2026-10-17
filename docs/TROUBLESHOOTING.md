# Troubleshooting

## `npm install` fails

Use Node.js 20+ and npm 10+. Run `npm install` from the repository root, where
the root `package.json` and lockfile are located. This project has no external
packages; do not install packages globally or add an alternate lockfile.

## `npm run build:site` fails

Run `npm test` first. Then run `npm run build` to identify which app build
failed. A valid `PUBLIC_WIDGET_URL`, if set, must be absolute HTTPS and not
localhost. If no production widget URL is available, leave the variable unset:
the app still builds, while the Test Console correctly disables snippet copy.
Inspect the reported error and use the exact workspace command in
`docs/DEPLOYMENT_GUIDE.md`.

## App or widget asset returns 404

For the unified build, check the output directory was set to `dist` and the
build command was `npm run build:site`. Check the exact case-sensitive paths:
`/console/`, `/store/`, `/legal/`, and `/packages/agent-sdk/widget.js`.
For an individual app, use that workspace's `dist` output instead of the
unified `dist`.

## Widget does not appear

Check that the host page uses `type="module"`, has `data-agent-widget`,
`data-site-id`, and `data-agent-id`, and loads over a supported modern browser.
The site and agent must be enabled and mutually assigned in
`packages/agent-registry/registry.js`. Unknown, disabled, or incompatible
configuration fails closed. Look for a `[Agent Testbed widget]` message if
`data-development="true"` is set. The widget does not make an API request.

If loading from another origin, check the browser console for module CORS
errors and verify `Access-Control-Allow-Origin` on all `/packages/` ESM
responses. Check host Content Security Policy `script-src` and any relevant
module loading policy. Do not weaken the entire host CSP.

## Snippet button is unavailable

This is intentional until `PUBLIC_WIDGET_URL` is set to a confirmed,
stable public HTTPS widget URL and the console is rebuilt. Do not substitute a
preview, localhost, invented URL, or credential. If deployed, inspect the
build-time environment variable and the console's displayed widget URL.

## Agent selection is empty or search has no results

Clear the search. Confirm registry metadata and site assignments are valid by
running `npm test`. A site can use only agent IDs present in both its
`allowedAgentIds` and the agent's `supportedSites`.

## Clipboard copy fails

Clipboard access is normally restricted to secure contexts and can be refused
by browser permissions. Use the visible message to manually select the code
block and copy its text. No success message is shown when the write fails.

## A test form does not contact anyone

That is the intended safety behavior. Home-services inquiry, legal intake,
and shop controls are local examples only; they do not send email, place an
order, book a visit, or dispatch a technician. Emergency situations are not
handled by this demo; contact local emergency services if someone is in danger.

## Widget appears more than once

The SDK deduplicates initialization per site/agent in a page. The standalone
fixture deliberately includes duplicate module tags to verify this behavior.
Remove duplicate installation snippets from the host page regardless.
