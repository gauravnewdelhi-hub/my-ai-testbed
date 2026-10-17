# MASTER IMPLEMENTATION PROMPT — AI AGENT TESTBED

## 1. Your role and mission

Act as a senior full-stack engineer, software architect, QA engineer, DevOps engineer, security engineer, and technical documentation writer.

Build a complete, working, production-conscious AI Agent Testbed in this existing GitHub repository:

- GitHub repository: `gauravnewdelhi-hub/my-ai-testbed`
- Existing Vercel project: `my-ai-testbed`
- Repository purpose: publicly accessible, brand-neutral testing environment for current and future AI agent products.

The owner is nontechnical. All implementation, deployment, testing, configuration, troubleshooting instructions, and future maintenance procedures must be designed for someone who primarily uses a browser, a graphical interface, and copy-and-paste instructions.

The objective is not to create an impressive-looking mockup. Deliver a functional, testable website platform with real navigation, working demo agents, a reusable embeddable JavaScript widget, copyable installation snippets, automated tests, and documented deployment procedures.

Work directly in the existing repository. Do not assume the repository is complete and add content, folders and files as needed.

Before making any changes:

1. Inspect the entire repository structure, including the existing `index.html`, `package.json`, lockfiles, GitHub configuration, Vercel configuration, and all existing source files.
2. Identify the current framework, build command, deployment configuration, and whether the project is currently deployable.
3. Identify any existing working functionality that must be preserved.
4. Create a written implementation plan with small, verifiable phases.
5. Report any missing information, credentials, configuration, or external services that prevent full implementation.

Rules:

- Never delete, replace, or rewrite existing files merely to simplify implementation.
- Do not overwrite working configuration without understanding its purpose.
- Preserve the existing Northstar Home Services website and its content, adapting it into the home-services demonstration application.
- Do not create duplicate configuration files or competing lockfiles.
- Do not introduce unnecessary frameworks, services, dependencies, or paid products.
- Do not commit secrets, API keys, access tokens, or credentials.
- Do not claim that something works unless it has actually been tested.
- Make small, logically grouped changes and verify them before proceeding.
- If a destructive operation or an architectural decision with significant consequences is necessary, explain it and request approval first.
- Never run commands that discard user changes, such as destructive Git resets, without explicit authorization.
- Do not deploy publicly until the build and applicable safety checks pass.
- Do not silently skip failed tests or conceal unresolved issues.

## 3. Owner's technical and budget constraints

Design for these conditions:

- Owner has limited programming knowledge.
- Primary development environment is browser-based VS Code, GitHub Codespaces, or GitHub's web editor.
- Source control is GitHub.
- Hosting is Vercel.
- Initial budget is zero or as close to zero as practical.
- Prefer free, open-source tools and free hosting tiers.
- Do not require a credit card, paid AI API, paid database, or paid third-party account to run the basic demonstration.
- Never assume that free hosting includes unlimited bandwidth, execution time, storage, or AI inference.
- Clearly identify any feature that requires a paid service or API key.
- Use simulated AI responses for initial demonstrations, but label them clearly as simulated.
- Provide a path to connect real AI models later without redesigning the widget architecture.
- Avoid premature microservices, complex infrastructure, and unnecessary enterprise frameworks.

## 4. Target architecture

Use an npm-workspaces monorepo unless inspection identifies a compelling compatibility reason not to.

Proposed structure:

my-ai-testbed/
  package.json
  package-lock.json
  README.md
  .gitignore
  .env.example
  apps/
    widget-harness/
    ecom-store/
    legal-portal/
    home-services/
  packages/
    agent-sdk/
    agent-registry/
    shared-ui/
    shared-config/
  docs/
    ARCHITECTURE.md
    AGENT_CATALOG.md
    ADD_REMOVE_CHANGE_AGENTS.md
    INSTALLATION_GUIDE.md
    DEPLOYMENT_GUIDE.md
    TROUBLESHOOTING.md
    SECURITY.md
    TEST_PLAN.md

This is a target, not permission to blindly create or relocate everything. Adapt it to the existing repository and explain significant deviations.

### Workspace requirements

- Use npm workspaces initially.
- Use compatible, stable dependencies and commit the appropriate lockfile.
- Avoid adding Turborepo unless there is a demonstrated benefit.
- Provide root commands to install dependencies, run each app, build everything, and run tests.
- Each application must be independently buildable and deployable.
- Shared packages must have clear responsibilities and documented public interfaces.
- Keep configuration consistent across workspaces.
- Ensure Vercel can deploy an individual app using the appropriate root directory and build settings.

## 5. Applications to implement

### A. Widget Harness / Agent Test Console

Build a professional, responsive dashboard for configuring and testing AI agents.

It must include:

1. Dashboard overview with the number of registered, enabled, disabled, and simulated agents.
2. Agent catalog with search, categories, descriptions, status, and capabilities.
3. Agent detail page showing configuration, compatibility, and installation instructions.
4. Agent preview area where the owner can interact with an agent.
5. Installation snippet generator.
6. Copy-to-clipboard functionality with visible success or failure feedback.
7. Installation testing instructions.
8. Basic diagnostics showing widget load status, selected agent, site configuration, and API connection status where applicable.
9. Documentation and troubleshooting links.
10. A clearly visible indication of simulated versus real AI functionality.
11. Responsive desktop and mobile layouts.
12. Helpful empty states and error messages.

Do not create fake controls that appear functional but do nothing.

If an action is not implemented, label it as unavailable or planned rather than implying success.

### B. E-commerce demonstration website

Create a realistic fictional online store with:

- Home page.
- Product listing.
- Product detail view.
- Shopping cart with working local demo functionality.
- Customer support or shopping assistant.
- Example product and shipping FAQs.
- Responsive design.
- Agent installation through the shared SDK.

Use fictional products and data. Do not collect payment information or implement real payment processing.

The site must remain usable if the agent is disabled or its service is unavailable.

### C. Legal firm demonstration website

Create a realistic fictional law firm's public-facing website with:

- Home page.
- Practice areas.
- Attorney profiles using fictional identities.
- Contact and consultation request demonstration.
- FAQ and intake assistant.
- Clear privacy and legal disclaimers.
- Agent installation through the shared SDK.

Do not provide automated legal advice or represent demo responses as professional legal services. Use fictional data and avoid collecting sensitive client information.

### D. Home-services demonstration website

Preserve and extend the existing Northstar Home Services `index.html`.

Retain its core design, service descriptions, accessibility, and responsive layout. Improve it only where necessary to integrate the shared widget and test installation.

Include:

- Heating and cooling.
- Appointment and service inquiry demonstration.
- Emergency-service inquiry flow with an explicit simulated-service disclaimer.
- A working chat launcher when an agent is enabled.
- A clear disabled state when no agent is configured.

Do not make real emergency calls, dispatch technicians, or create real appointments in the initial implementation.

## 6. Shared agent SDK and installation script

Build a reusable JavaScript package that produces a browser-loadable widget script.

Preferred public installation format:

<script
  async
  src="https://YOUR-WIDGET-HOST/agent-widget.js"
  data-site-id="YOUR-SITE-ID"
  data-agent-id="home-services-assistant-demo">
</script>

This is an illustrative format. Implement the final filename and attributes consistently throughout the code, documentation, generated snippets, and tests.

### Core SDK requirements

The widget must:

1. Load asynchronously without blocking the host website.
2. Identify the host website using a public site identifier.
3. Identify the requested agent using an explicit configuration attribute.
4. Display a floating launcher and a chat panel.
5. Open and close reliably.
6. Support keyboard navigation, visible focus, accessible labels, and appropriate contrast.
7. Work on desktop and mobile.
8. Avoid modifying unrelated page content or host-site styles.
9. Use isolated CSS naming and preferably Shadow DOM when compatible with the implementation.
10. Handle missing configuration gracefully.
11. Handle network errors, unavailable agents, and invalid site IDs gracefully.
12. Avoid breaking the host website if the widget fails.
13. Prevent duplicate widget initialization.
14. Provide a documented way to disable or remove the widget.
15. Expose no secrets in browser-delivered code.
16. Support a configurable title, welcome message, theme, and launcher position.
17. Display loading, empty, error, and conversation states.
18. Use safe DOM rendering and prevent HTML/script injection from messages.
19. Avoid collecting or transmitting unnecessary visitor information.
20. Respect applicable privacy requirements and disclose any data transmission.
21. Provide clear console diagnostics in development mode without leaking sensitive information.
22. Support multiple host websites with different configurations.
23. Never trust a site ID alone as authorization to access privileged backend operations.

### Public distribution

The published widget must be served from a stable HTTPS URL.

The host website must not need to import React, install npm packages, or run a build process merely to install the widget.

The host website should need only the script tag.

Document how to distribute the script through the chosen hosting platform and how to update it safely.

Do not assume that a workspace package automatically becomes publicly accessible. Build and deploy a browser-compatible artifact.

### Cross-origin behavior

Account for:

- Content Security Policy.
- Cross-origin resource loading.
- API CORS restrictions.
- Script caching and versioning.
- Third-party cookie restrictions.
- Browser compatibility.
- Ad blockers or network failures.

Prefer token-based, narrowly scoped site configuration over relying on browser cookies.

## 7. Agent registry and lifecycle management

Create a single, clearly documented source of truth for the initial agent catalog.

Prefer a typed configuration file or registry module over manually duplicating agent details throughout the UI.

Every agent definition should support fields such as:

- Unique, stable ID.
- Display name.
- Description.
- Category.
- Version.
- Enabled/disabled status.
- Runtime type.
- Supported demo applications.
- Capabilities.
- Configuration schema.
- Default configuration.
- Required environment variables or services.
- Simulation mode.
- Backend endpoint, if applicable.
- Installation compatibility.
- Documentation reference.

Use a structure that can grow without forcing every agent to use the same provider or implementation.

Separate agent metadata, widget presentation, and AI execution logic.

### Initial agents

Register at least these entries:

1. `home-services-assistant-demo` — home-services receptionist and lead-intake demonstration.
2. `shopping-assistant-demo` — fictional store support and product FAQ demonstration.
3. `legal-intake-demo` — fictional law firm intake and general FAQ demonstration.
4. `general-assistant-demo` — reusable generic assistant.

Initially, all four may use a clearly labeled deterministic simulation runtime.

The simulation should produce useful, context-appropriate responses and support basic conversational follow-up without calling a paid model API.

Do not describe simulated responses as generated by a live AI model.

### Future runtime design

Define an adapter interface so different agents can later use:

- Local deterministic simulations.
- A server-side Gemini integration.
- Other hosted LLM providers.
- An internal agent API.
- Workflow or tool-based agents.
- Voice agents.
- Specialized agents with their own backend services.

Do not implement every future integration now. Build the extension points and document the work required to add them.

Provider credentials must remain on the server, never in browser JavaScript or public configuration.

## 8. Installation snippet generator

In the Agent Test Console, let the owner select:

- Demo website.
- Agent.
- Site identifier.
- Enabled/disabled status.
- Supported appearance settings.
- Simulation or configured runtime, when available.

Generate the exact HTML snippet for that selection.

Include:

- Copy snippet button.
- Copy confirmation.
- Human-readable installation steps.
- The target website's public URL.
- The widget script's actual public URL when configured.
- A clear warning if the script has not yet been deployed.
- A troubleshooting checklist.
- A way to open the demo website and test the installed agent.

Do not generate fake deployment URLs or claim that a placeholder URL is live.

### Site identification

Use stable, unique demo site IDs, for example:

- `northstar-home-demo`
- `ecom-store-demo`
- `legal-portal-demo`

Use the actual IDs consistently in configuration and generated snippets.

If site registration is implemented, define how new sites are created, validated, disabled, and removed.

Treat browser-visible site IDs as identifiers, not secrets.

## 9. Site and agent configuration

Provide a simple configuration mechanism that does not require editing source code for ordinary changes.

The initial version may use version-controlled configuration files rather than a database.

Document exactly which file controls:

- Agent availability.
- Agent names and descriptions.
- Site-to-agent assignments.
- Welcome messages.
- Themes.
- Simulation behavior.
- Runtime selection.

The test console should display configuration read from the real registry.

Do not build an unrestricted administrative API or publicly writable configuration store.

If browser-based configuration editing is not secure or practical without authentication and persistence, provide a safe configuration-file workflow and explain its limitations.

Never imply that changes made in a browser will persist across sessions unless persistence has actually been implemented.

## 10. AI backend and serverless deployment

Keep the initial system functional without external AI credentials.

Where an API is required, create a clearly defined server-side runtime interface and document its deployment.

Before implementing a serverless backend, verify the capabilities and limitations of the chosen Vercel plan and runtime.

Avoid an always-on server or paid database requirement for the initial demonstration.

If a real AI integration is added later:

- Make the provider optional.
- Keep API keys in server-side environment variables.
- Validate incoming requests.
- Validate agent and site configuration.
- Apply request size limits.
- Add sensible rate limiting.
- Set timeouts and handle provider errors.
- Avoid logging sensitive conversation content unnecessarily.
- Include usage and cost warnings.
- Provide a simulation fallback only when it can be clearly distinguished from real model output.
- Never silently pretend a failed AI request succeeded.

Do not implement real calendar bookings, CRM writes, email sending, or other external side effects without explicit configuration and safeguards.

## 11. Security and privacy

Implement appropriate protections for a publicly accessible demo.

Requirements:

- No credentials committed to Git.
- Provide `.env.example` containing placeholder names only.
- Validate API input on the server.
- Avoid unsafe HTML rendering.
- Prevent accidental disclosure of environment variables.
- Restrict CORS to documented demo origins where practical.
- Explain the trade-offs of public embedding.
- Apply basic abuse controls to public API routes.
- Avoid unrestricted proxy endpoints that allow arbitrary model or URL access.
- Do not use client-provided site IDs as proof of authorization.
- Do not expose admin-only functions to anonymous visitors.
- Do not collect real personal, legal, financial, or health information in demo conversations.
- Add clear demo notices and privacy guidance.
- Ensure a widget can be disabled without rebuilding the host website where configuration supports it.

Do not claim that a static public demo has enterprise-grade authentication, tenant isolation, or production security if those controls do not exist.

## 12. Automated testing and quality

Create automated tests appropriate to the actual stack.

At minimum, verify:

1. Workspace dependencies install successfully.
2. All applications build successfully.
3. The registry contains valid, unique agent IDs.
4. Each initial agent can be resolved by ID.
5. Disabled agents do not launch.
6. Unknown agents fail gracefully.
7. Missing site IDs produce a useful error.
8. The installation snippet contains the correct script URL and identifiers.
9. The widget can initialize, open, close, and display a simulated response.
10. Duplicate script loading does not create duplicate widgets.
11. Invalid input is handled safely.
12. The widget does not break the host page when an optional service fails.
13. Basic keyboard interaction works.
14. Mobile layouts are usable.
15. API routes reject invalid requests where applicable.
16. No secrets are included in browser build artifacts.
17. The three demo sites remain independently buildable.
18. The root README and maintenance documentation agree with the actual implementation.

Use browser-based end-to-end testing if compatible with the environment. If a browser or test dependency cannot be installed or executed, document the limitation and provide the strongest available alternative.

Never mark a test as passed if it was not run.

## 13. Deployment architecture

Use the existing Vercel and GitHub connection where possible.

Recommended deployment targets:

- Agent Test Console.
- E-commerce demo.
- Legal demo.
- Home-services demo.
- Widget SDK distribution.

Do not automatically create unnecessary Vercel projects if a shared project can serve the current purpose.

Inspect the existing Vercel configuration and deployment before making changes.

For each application, document:

- Vercel project root directory.
- Framework preset.
- Install command.
- Build command.
- Output directory.
- Required environment variables.
- Public URL.
- Whether the application has its own backend.
- Whether a redeployment is required after configuration changes.

Use Vercel's supported monorepo deployment configuration. Ensure each project builds from the correct workspace and that required shared packages are available.

Do not assume that all projects can share the same domain or that a widget file in one workspace is automatically accessible from another deployment.

If deployment automation cannot be configured safely from the current environment, prepare exact, beginner-friendly manual steps.

### Deployment safety

- Test local or workspace builds first.
- Do not overwrite an existing working production deployment unnecessarily.
- Do not expose private preview URLs as permanent public installation URLs.
- Confirm the deployment is ready before documenting it as live.
- Explain how to roll back to the previous deployment.
- Do not claim a live deployment was verified unless the published URL was actually checked.

## 14. Public-link testing procedure

Create a beginner-friendly guide that explains how to test the published site from a normal browser, including an incognito/private window.

The guide must cover:

1. Open the public home-services demo.
2. Confirm the page loads over HTTPS.
3. Confirm the widget script is requested successfully.
4. Confirm the launcher appears.
5. Open the widget.
6. Send a test message.
7. Confirm the expected simulated or real response.
8. Refresh the page and test again.
9. Test on a mobile viewport or mobile device.
10. Open the widget console and check diagnostics if available.
11. Disable the agent and confirm it no longer launches.
12. Test an unknown agent ID and verify graceful failure.
13. Check that the rest of the website still works if the widget is unavailable.
14. Verify that the published snippet points to the deployed widget URL rather than localhost, a temporary preview URL, or an invented placeholder.
15. Explain how to test the same snippet on a separately hosted HTML website.

Provide a small standalone HTML test page that can be used to validate the script independently of the three demo apps.

Do not expose private credentials or include secrets in the test page.

## 15. Adding, changing, disabling, and removing agents

Create a complete nontechnical guide in `docs/ADD_REMOVE_CHANGE_AGENTS.md`.

Explain the following procedures separately.

### Add an agent

- Open the repository in browser-based VS Code.
- Locate the actual registry file.
- Copy the documented agent-definition example.
- Give the new agent a unique ID.
- Add its name, description, capabilities, supported sites, and runtime.
- Register a simulation or implement the required runtime adapter.
- Run the documented validation and build commands.
- Commit the change through the Git interface.
- Wait for Vercel deployment.
- Open the public test console.
- Confirm the agent appears and its generated snippet works.

### Change an agent

Explain how to edit:

- Name and description.
- Welcome message.
- Theme.
- Supported demo websites.
- Enabled status.
- Runtime selection.
- Version and configuration.

Clarify which changes are metadata-only and which require code or server configuration.

### Disable an agent

Explain how to disable it without deleting its implementation or breaking previously published demo pages.

Verify that disabled agents are rejected or hidden as appropriate.

### Remove an agent

Explain how to remove the registry entry, any dedicated implementation, associated test fixtures, and obsolete documentation without deleting shared SDK functionality or unrelated agents.

Explain how to handle old installation snippets that still reference the removed agent.

### Update an agent

Explain how to make a change, validate it, deploy it, and confirm the published version.

Where appropriate, provide a versioning strategy and a way to roll back.

All instructions must match the actual file names, commands, and UI controls created by the implementation. Never provide hypothetical paths as if they were verified.

## 16. Documentation deliverables

Create and maintain:

### README.md

Include:

- Project purpose.
- Architecture overview.
- Repository layout.
- Prerequisites.
- Setup instructions.
- Available apps.
- Local development commands.
- Build and test commands.
- Deployment overview.
- Links to detailed guides.

### docs/ARCHITECTURE.md

Explain the actual implementation, package responsibilities, data flow, deployment boundaries, and extension points.

### docs/AGENT_CATALOG.md

List every registered agent, its actual status, runtime, supported sites, and limitations.

### docs/ADD_REMOVE_CHANGE_AGENTS.md

Provide step-by-step agent maintenance procedures for a nontechnical owner.

### docs/INSTALLATION_GUIDE.md

Explain script installation, generated snippets, site IDs, HTTPS, cross-origin behavior, and how to test on external websites.

### docs/DEPLOYMENT_GUIDE.md

Explain how to publish each application through the actual Vercel setup.

### docs/TROUBLESHOOTING.md

Include real, likely failure cases and specific fixes.

### docs/SECURITY.md

Describe actual implemented protections, known limitations, privacy considerations, and the difference between a public demo and a production service.

### docs/TEST_PLAN.md

List automated tests, manual test steps, expected results, and any untested areas.

Keep the documentation aligned with the implementation. Do not document functionality that does not exist.

## 17. Implementation phases

Implement the project in small, independently verifiable phases.

### Phase 0 — Discovery

- Inspect the repository.
- Identify the current deployment state and technology stack.
- Preserve all working files.
- Report the proposed architecture and risks.
- Identify any blockers.

### Phase 1 — Foundation

- Establish the appropriate workspace configuration.
- Preserve the existing Northstar page.
- Create the shared agent registry and SDK boundaries.
- Add basic documentation.
- Verify dependencies and builds.

### Phase 2 — Functional widget

- Implement the browser-loadable widget.
- Implement the four simulation agents.
- Add the floating launcher, chat panel, and safe message handling.
- Verify behavior in a host website.

### Phase 3 — Demo applications

- Complete the home-services site.
- Build the e-commerce demo.
- Build the legal portal.
- Integrate the same SDK into all three.
- Verify each app independently.

### Phase 4 — Test Console

- Build the agent catalog.
- Add selection and preview.
- Implement snippet generation and copy functionality.
- Add diagnostics and installation guidance.
- Ensure controls reflect actual configuration.

### Phase 5 — Automated validation

- Run all available checks.
- Fix build failures and functional regressions.
- Test invalid configurations and disabled agents.
- Validate the published-widget artifact.

### Phase 6 — Deployment

- Configure the existing Vercel setup appropriately.
- Deploy each required application.
- Publish the widget to a stable HTTPS URL.
- Confirm each deployment.
- Test the actual public installation snippet.

### Phase 7 — Handover

- Complete documentation.
- Provide the verified public URLs.
- Explain how to add, change, disable, and remove agents.
- List anything requiring manual configuration.
- List any remaining limitations.

Do not treat the phases as permission to skip verification. Do not deploy incomplete work merely to claim progress.

If the environment or available Copilot quota prevents completion in one session, finish the current safe phase, record its status, and provide the exact next steps for resuming. Never claim that the whole project is complete when it is not.

## 18. Acceptance criteria

The project is complete only when all applicable criteria below have been verified:

- Existing Northstar website content and core functionality are preserved.
- All three demo websites build independently.
- The Test Console loads and displays the registered agents.
- All four initial simulation agents can be tested.
- The widget works through a real script tag in a host website.
- A user can copy an accurate installation snippet.
- The snippet uses the real published HTTPS widget URL.
- The widget works from the public deployment, not just a local development server.
- Disabled and unknown agents are handled safely.
- The basic demonstration works without paid AI services or credentials.
- Error states are understandable.
- Automated tests have been executed and results recorded.
- No secrets are committed or exposed in public bundles.
- Agent maintenance instructions match the real code.
- The deployment and rollback procedures are documented.
- Every incomplete or unverified item is explicitly listed.

## 19. Final reporting requirements

At the end, provide a concise but complete handover report containing:

1. What existed before the changes.
2. What was created or changed.
3. The final repository structure.
4. The exact commands needed for future development.
5. The test results, including failed or skipped tests.
6. Each verified public deployment URL.
7. The exact working installation snippet.
8. Which agents use simulation versus a real AI model.
9. How to add, modify, disable, and remove agents.
10. Which configuration changes require redeployment.
11. Any remaining manual actions, credentials, service dependencies, or costs.
12. Known limitations and recommended next steps.

Clearly distinguish verified results from assumptions.

Start with Phase 0. Inspect first, explain your plan, and proceed using small, reversible changes. Never fabricate test results, deployment URLs, credentials, or working integrations.