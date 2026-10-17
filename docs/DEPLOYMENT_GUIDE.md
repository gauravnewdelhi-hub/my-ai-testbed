# Vercel deployment guide

## What has and has not been verified

The source contains `vercel.json` and static build targets, but the environment
did not contain an authenticated Vercel CLI, Vercel project linkage, confirmed
production domain, or GitHub CLI authentication. No deployment was made or
verified. Do not call a preview URL a production widget URL.
The conventional slug URL `https://my-ai-testbed.vercel.app` was checked and
returned a Vercel 404; the actual project may use another domain.

The recommended first deployment is one static Vercel project with the
complete site. It preserves the existing project model while serving the
console, demos, docs, and shared widget from one HTTPS origin. Individual app
outputs are also independently buildable if separate projects are later
needed.

## Before connecting Vercel

1. In Codespaces or a local terminal, run `npm install`, `npm test`, and
   `npm run build:site`. Resolve all failures before publishing.
2. Inspect `dist/` and confirm it contains `index.html`, `console/index.html`,
   `store/index.html`, `legal/index.html`, `packages/agent-sdk/widget.js`,
   and `docs/`.
3. In the Vercel browser dashboard, verify which team/account owns the existing
   `my-ai-testbed` project and confirm the intended GitHub repository and
   production branch before linking or changing settings.
4. In the project settings, use **Framework Preset: Other**, **Root Directory:
   `.`**, **Install Command: `npm install`**, **Build Command:
   `npm run build:site`**, **Output Directory: `dist`**, and no Development or
   Build-time secrets. Keep the Root Directory set to the repository root so
   npm workspaces and shared packages are available.
5. Deploy a preview first. Test the routes and widget behavior there, but do
   not distribute its URL as a permanent installation URL.
6. Assign/confirm the production domain in Vercel. Verify it serves HTTPS, and
   open `/`, `/console/`, `/store/`, `/legal/`, and
   `/packages/agent-sdk/widget.js`.

## Configure the snippet URL

The Test Console intentionally does not infer a production hostname. Set the
public build-time Vercel environment variable `PUBLIC_WIDGET_URL` to the
confirmed production URL, including the exact path
`https://your-confirmed-production-host/packages/agent-sdk/widget.js`.
This value is public, not a secret. The build rejects non-HTTPS and localhost
values. Trigger a new production deployment after setting it; the console will
then generate and copy a snippet. In the recommended unified build, the
console uses that production origin plus `/`, `/store/`, or `/legal/` to link
to the selected site. For separate deployments, set each site's `publicUrl`
in `packages/agent-registry/registry.js` to its actual public URL. Confirm each
URL directly in a browser before using it on an external website. No stable
URL was available during this implementation, so no snippet is currently
verified.

## Four separate app deployments (optional)

For an app-specific deployment, make another Vercel project for the same repo
only if a separate domain or lifecycle is actually needed. Keep **Root
Directory** `.`. Use the workspace command and output folder shown here:

| App | Build command | Output directory |
| --- | --- | --- |
| Home Services | `npm run build --workspace=@Agent Testbed/home-services` | `apps/home-services/dist` |
| Test Console | `npm run build --workspace=@Agent Testbed/widget-harness` | `apps/widget-harness/dist` |
| E-commerce | `npm run build --workspace=@Agent Testbed/ecom-store` | `apps/ecom-store/dist` |
| Legal Portal | `npm run build --workspace=@Agent Testbed/legal-portal` | `apps/legal-portal/dist` |

Each output includes the shared modules. For external embedding from one of
these deployments, use its stable production domain as the widget origin and
verify the `/packages/` CORS response headers. Separate project settings and
domains are not pre-created.

## Redeploy and rollback

Changes to registry configuration, demo content, simulator code, SDK code,
Vercel headers, or documentation require a build/deploy. Vercel can redeploy
the prior good production deployment from the project's Deployment history.
Test the rollback's URLs and widget asset before considering it complete.
Configuration edits in the console are not persisted and never replace a
registry commit.

Vercel free-tier limits and terms can change; check the current account plan
before relying on bandwidth, build, or function limits. This project currently
uses static assets only and has no serverless functions.
