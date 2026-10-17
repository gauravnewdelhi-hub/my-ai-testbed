import { resolveConfiguration } from "/packages/agent-registry/registry.js";

const state = document.querySelector("#agent-status");
const configuration = resolveConfiguration("northstar-home-demo", "home-services-assistant-demo");
state.textContent = configuration.ok
  ? "Service assistant: enabled and simulated. No appointment, dispatch, or emergency call is made."
  : `Service assistant unavailable: ${configuration.reason}`;
