export const widgetConfigurationSchema = Object.freeze({
  title: { type: "string", maxLength: 100 },
  welcomeMessage: { type: "string", maxLength: 500 },
  theme: { type: "enum", values: ["green", "blue", "navy", "slate"] },
  position: { type: "enum", values: ["left", "right"] }
});

export const agents = [
  {
    id: "home-services-assistant-demo",
    name: "Home Services Receptionist",
    description: "A simulated receptionist for HVAC questions and service inquiries.",
    category: "Home services",
    version: "1.0.0",
    enabled: true,
    runtime: "simulation",
    supportedSites: ["northstar-home-demo"],
    capabilities: ["HVAC FAQs", "Service inquiry guidance", "Emergency disclaimer"],
    requiredServices: [],
    simulation: true,
    configurationSchema: widgetConfigurationSchema,
    configuration: {
      title: "Northstar service assistant",
      welcomeMessage: "Hi! I can answer general HVAC questions or explain how to make a service inquiry. This is a simulation; no appointment or dispatch is created.",
      theme: "green",
      position: "right"
    },
    documentation: "docs/AGENT_CATALOG.md"
  },
  {
    id: "shopping-assistant-demo",
    name: "Shop Support Assistant",
    description: "A fictional shop helper for product and shipping questions.",
    category: "E-commerce",
    version: "1.0.0",
    enabled: true,
    runtime: "simulation",
    supportedSites: ["ecom-store-demo"],
    capabilities: ["Fictional product FAQs", "Shipping FAQs", "Demo cart guidance"],
    requiredServices: [],
    simulation: true,
    configurationSchema: widgetConfigurationSchema,
    configuration: {
      title: "Northstar Goods assistant",
      welcomeMessage: "Welcome! Ask about our fictional products, shipping, or demo cart. There is no real checkout.",
      theme: "blue",
      position: "right"
    },
    documentation: "docs/AGENT_CATALOG.md"
  },
  {
    id: "legal-intake-demo",
    name: "Fictional Legal Intake Assistant",
    description: "A general-information and fictional contact-flow demonstration; not legal advice.",
    category: "Legal",
    version: "1.0.0",
    enabled: true,
    runtime: "simulation",
    supportedSites: ["legal-portal-demo"],
    capabilities: ["Practice-area FAQs", "Non-sensitive inquiry guidance", "Legal disclaimer"],
    requiredServices: [],
    simulation: true,
    configurationSchema: widgetConfigurationSchema,
    configuration: {
      title: "Harbor & Pine information assistant",
      welcomeMessage: "I can share general information about this fictional firm. I am not a lawyer and cannot provide legal advice. Please do not share confidential details.",
      theme: "navy",
      position: "right"
    },
    documentation: "docs/AGENT_CATALOG.md"
  },
  {
    id: "general-assistant-demo",
    name: "General Assistant",
    description: "A reusable, deterministic assistant for the demo websites.",
    category: "General",
    version: "1.0.0",
    enabled: true,
    runtime: "simulation",
    supportedSites: ["northstar-home-demo", "ecom-store-demo", "legal-portal-demo"],
    capabilities: ["General FAQs", "Demo navigation", "Safe fallback responses"],
    requiredServices: [],
    simulation: true,
    configurationSchema: widgetConfigurationSchema,
    configuration: {
      title: "Demo assistant",
      welcomeMessage: "Hello! I can help with general questions about this demonstration site. This assistant is simulated.",
      theme: "slate",
      position: "right"
    },
    documentation: "docs/AGENT_CATALOG.md"
  }
];

export const sites = [
  {
    id: "northstar-home-demo",
    name: "Northstar Home Services",
    app: "home-services",
    publicUrl: "",
    deploymentPath: "/",
    enabled: true,
    defaultAgentId: "home-services-assistant-demo",
    allowedAgentIds: ["home-services-assistant-demo", "general-assistant-demo"]
  },
  {
    id: "ecom-store-demo",
    name: "Northstar Goods",
    app: "ecom-store",
    publicUrl: "",
    deploymentPath: "/store/",
    enabled: true,
    defaultAgentId: "shopping-assistant-demo",
    allowedAgentIds: ["shopping-assistant-demo", "general-assistant-demo"]
  },
  {
    id: "legal-portal-demo",
    name: "Harbor & Pine Legal",
    app: "legal-portal",
    publicUrl: "",
    deploymentPath: "/legal/",
    enabled: true,
    defaultAgentId: "legal-intake-demo",
    allowedAgentIds: ["legal-intake-demo", "general-assistant-demo"]
  }
];

export const agentById = (id) => agents.find((agent) => agent.id === id);
export const siteById = (id) => sites.find((site) => site.id === id);

export function resolveConfiguration(siteId, agentId) {
  if (!siteId || typeof siteId !== "string") {
    return { ok: false, reason: "Add a valid data-site-id to the widget script." };
  }
  if (!agentId || typeof agentId !== "string") {
    return { ok: false, reason: "Add a valid data-agent-id to the widget script." };
  }
  const site = siteById(siteId);
  if (!site || !site.enabled) {
    return { ok: false, reason: "This demo site is unknown or disabled." };
  }
  const agent = agentById(agentId);
  if (!agent || !agent.enabled) {
    return { ok: false, reason: "This agent is unknown or disabled." };
  }
  if (!site.allowedAgentIds.includes(agent.id) || !agent.supportedSites.includes(site.id)) {
    return { ok: false, reason: "This agent is not configured for the selected site." };
  }
  return { ok: true, site, agent };
}

export function buildInstallSnippet({ siteId, agentId, scriptUrl, configuration = {} }) {
  const resolved = resolveConfiguration(siteId, agentId);
  if (!resolved.ok) throw new Error(resolved.reason);
  let url;
  try {
    url = new URL(scriptUrl);
  } catch {
    throw new Error("Set the deployed widget URL before generating an installation snippet.");
  }
  if (url.protocol !== "https:" || ["localhost", "127.0.0.1"].includes(url.hostname) ||
      url.username || url.password || url.search || url.hash ||
      !url.pathname.endsWith("/packages/agent-sdk/widget.js")) {
    throw new Error("The widget URL must be a stable public HTTPS URL.");
  }
  const { agent } = resolved;
  const values = {
    title: configuration.title ?? agent.configuration.title,
    welcome: configuration.welcome ?? agent.configuration.welcomeMessage,
    theme: configuration.theme ?? agent.configuration.theme,
    position: configuration.position ?? agent.configuration.position
  };
  if (typeof values.title !== "string" || values.title.length > 100 ||
      typeof values.welcome !== "string" || values.welcome.length > 500) {
    throw new Error("Widget title and welcome message must be plain text within the supported length limits.");
  }
  if (!["green", "blue", "navy", "slate"].includes(values.theme)) {
    throw new Error("Choose a supported widget theme.");
  }
  if (!["left", "right"].includes(values.position)) {
    throw new Error("Choose a supported widget position.");
  }
  const attr = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  return `<script type="module" async src="${attr(url.href)}" data-agent-widget data-site-id="${siteId}" data-agent-id="${agentId}" data-title="${attr(values.title)}" data-welcome="${attr(values.welcome)}" data-theme="${values.theme}" data-position="${values.position}"></script>`;
}

export function getRegistryErrors() {
  const errors = [];
  const ids = new Set();
  for (const agent of agents) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent.id)) errors.push(`Invalid agent ID: ${agent.id}`);
    if (ids.has(agent.id)) errors.push(`Duplicate agent ID: ${agent.id}`);
    ids.add(agent.id);
    if (!agent.name || !agent.description || !agent.version) errors.push(`Incomplete agent metadata: ${agent.id}`);
    if (!Array.isArray(agent.supportedSites) || !Array.isArray(agent.capabilities)) errors.push(`Invalid capabilities or sites: ${agent.id}`);
    if (agent.runtime === "simulation" && agent.simulation !== true) errors.push(`Simulation runtime must be clearly marked: ${agent.id}`);
  }
  const siteIds = new Set();
  for (const site of sites) {
    if (siteIds.has(site.id)) errors.push(`Duplicate site ID: ${site.id}`);
    siteIds.add(site.id);
    if (!site.allowedAgentIds.includes(site.defaultAgentId)) errors.push(`Default agent is not allowed on ${site.id}`);
    for (const agentId of site.allowedAgentIds) {
      const agent = agentById(agentId);
      if (!agent || !agent.supportedSites.includes(site.id)) errors.push(`Invalid site/agent assignment: ${site.id} / ${agentId}`);
    }
  }
  return errors;
}
