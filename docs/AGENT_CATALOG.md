# Agent catalog

All entries below are read from
[`packages/agent-registry/registry.js`](../packages/agent-registry/registry.js).
Every agent is enabled and uses deterministic local simulation (`SIMULATED`).
None calls a live AI model, network service, booking service, or business system.

| Stable ID | Name | Category | Assigned demo site | Capabilities | Limitations |
| --- | --- | --- | --- | --- | --- |
| `Home Services-demo` | Home Services Home Services Receptionist | Home services | `northstar-home-demo` | HVAC FAQs, inquiry guidance, emergency disclaimer | Cannot diagnose, book, dispatch, or call emergency services |
| `shopping-assistant-demo` | Shop Support Assistant | E-commerce | `ecom-store-demo` | Fictional product, shipping, and cart FAQs | Fictional inventory; no order, payment, or account |
| `legal-intake-demo` | Fictional Legal Intake Assistant | Legal | `legal-portal-demo` | Practice area FAQs and safe inquiry guidance | Not a lawyer; no legal advice, client relationship, or real intake |
| `general-assistant-demo` | General Assistant | General | All three demo sites | General FAQs and demo navigation | Deterministic fallback, not a general-purpose live AI |

Each site also records its own `allowedAgentIds`, default agent, and enabled
flag in the same registry module. The general assistant may be selected on
each of the three demo sites. No external services or environment variables
are required to run the current catalog.

Agent details include a version, runtime, simulation flag, required services,
configuration defaults (title, welcome, theme, position), capabilities, site
compatibility, and documentation reference. The console displays actual
registry values. A browser selection does not alter or persist registry
configuration. To disable an entry, change `enabled` in the registry, rebuild,
and redeploy.

The shared widget configuration schema is exported as
`widgetConfigurationSchema` in the same module. Runtime adapters currently
implement the `simulationRuntime.respond({ agentId, input, history })` contract.
