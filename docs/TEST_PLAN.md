# Test plan and current verification

## Automated checks

Run from the repository root:

```sh
npm install
npm test
npm run build
npm run test:check
npm run build:site
```

`npm test` uses Node's built-in test runner. It verifies unique and consistent
registry assignments, enabled/unknown/missing/incompatible configuration,
HTTPS snippet validation, and deterministic contextual/safety replies.
`npm run build` builds all four independent applications.
`npm run test:check` builds the app and unified outputs, runs tests, and checks
the artifact paths and widget installation. `npm run build:site` assembles the
single-project Vercel output.
None of these checks is a browser automation suite.

## Manual browser checks

Test each app at its local development URL and each deployed public HTTPS URL:

1. Open the Northstar page and verify HVAC/service descriptions, responsive
   layout, inquiry confirmation, and explicit no-dispatch safety notice.
2. Open the console, verify all four registry agents/status counts, search,
   detail, preview conversation, and disabled-copy warning when the widget URL
   is unconfigured.
3. Open the store: inspect details, add multiple products, confirm cart count
   and total, clear cart, and check there is no checkout/payment.
4. Open the fictional legal portal: inspect practices/profiles, choose a broad
   topic and preview the local-only confirmation, and confirm disclaimers.
5. On the standalone page, verify two identical script tags mount one widget,
   open the panel, submit a harmless prompt, verify a simulated response,
   close by button and Escape, refresh, and confirm the conversation clears.
6. Use keyboard-only Tab/Enter/Space navigation and visible focus. Check the
   launcher and chat panel on a narrow mobile viewport and a real mobile
   browser if available.
7. Test missing, unknown, disabled, and incompatible IDs by changing test
   markup in a local copy; verify the widget fails closed and the host page
   continues working.
8. Test external HTTPS installation and verify all ESM requests succeed with
   CORS headers, host Content Security Policy is satisfied, and the snippet
   references the stable deployed artifact rather than localhost/preview.
9. Use a private window to repeat the test, inspect cache behavior, and
   temporarily block the widget request to confirm the host still works.
10. Check the Network panel to confirm no conversation is sent and scan the
    public artifacts for secrets.

The cross-origin public deployment procedure requires Vercel project access
and a stable domain; neither was available in the implementation environment.
Do not mark those manual checks passed until they have been run against a real
deployed URL.

## Results

Verified in this workspace:

- `npm install` completed; npm reported zero vulnerabilities and the workspaces
  have no external package dependencies.
- `npm run test:check` passed: all four individual app outputs and unified
  `dist/` built, all five Node tests passed, and artifact/configuration/secret
  checks passed.
- JavaScript syntax checks, Vercel JSON parsing, and `git diff --check` passed.
- Local HTTP smoke tests returned `200` for each app root, shared widget and
  registry modules, each app entry script, and the standalone fixture.
- The likely slug URL `https://my-ai-testbed.vercel.app` returned Vercel `404`;
  this does not identify the actual configured production domain.

Not verified: browser interaction (no browser executable or Playwright/
Puppeteer installation was available), screen-reader conformance, live
cross-origin CORS response headers, mobile browser rendering, or public
deployment. Manual checks not executed must remain listed as unverified.
