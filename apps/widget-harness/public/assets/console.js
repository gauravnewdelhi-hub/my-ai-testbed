import {
  agents,
  buildInstallSnippet,
  resolveConfiguration,
  sites
} from "/packages/agent-registry/registry.js";
import { simulationRuntime } from "/packages/agent-registry/simulation.js";

const $ = (selector) => document.querySelector(selector);
const widgetUrl = document.querySelector('meta[name="widget-url"]').content.trim();
let selectedAgent = agents.find((agent) => agent.enabled) ?? null;
let previewHistory = [];

function addMessage(container, content, role) {
  const message = document.createElement("div");
  message.className = `preview-message ${role}`;
  message.textContent = content;
  container.append(message);
  container.scrollTop = container.scrollHeight;
}

function renderStats() {
  const values = [
    ["Registered", agents.length],
    ["Enabled", agents.filter((agent) => agent.enabled).length],
    ["Disabled", agents.filter((agent) => !agent.enabled).length],
    ["Simulated", agents.filter((agent) => agent.simulation).length]
  ];
  $("#stats").replaceChildren(...values.map(([label, count]) => {
    const card = document.createElement("div");
    card.className = "stat";
    const number = document.createElement("strong");
    number.textContent = String(count);
    const title = document.createElement("span");
    title.textContent = label;
    card.append(number, title);
    return card;
  }));
}

function renderAgentList() {
  const list = $("#agent-list");
  list.replaceChildren();
  const query = $("#search").value.trim().toLowerCase();
  const matches = agents.filter((agent) =>
    `${agent.name} ${agent.description} ${agent.category} ${agent.capabilities.join(" ")}`.toLowerCase().includes(query)
  );
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No agents match this search. Try a name, category, or capability.";
    list.append(empty);
    return;
  }
  for (const agent of matches) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "agent-card";
    card.setAttribute("aria-pressed", String(selectedAgent?.id === agent.id));
    const top = document.createElement("div");
    top.className = "agent-card-top";
    const name = document.createElement("strong");
    name.textContent = agent.name;
    const status = document.createElement("span");
    status.className = "badge";
    status.textContent = agent.enabled ? "SIMULATED" : "DISABLED";
    top.append(name, status);
    const description = document.createElement("p");
    description.textContent = agent.description;
    const capabilityList = document.createElement("div");
    capabilityList.className = "capabilities";
    for (const capability of agent.capabilities) {
      const item = document.createElement("span");
      item.className = "capability";
      item.textContent = capability;
      capabilityList.append(item);
    }
    card.append(top, description, capabilityList);
    card.addEventListener("click", () => {
      selectedAgent = agent;
      previewHistory = [];
      renderAgentList();
      renderAgentDetail();
      renderInstall();
    });
    list.append(card);
  }
}

function renderAgentDetail() {
  const container = $("#agent-detail");
  container.replaceChildren();
  if (!selectedAgent) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Select an enabled agent to view its details.";
    container.append(empty);
    return;
  }
  const detail = document.createElement("section");
  detail.className = "agent-detail";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = `${selectedAgent.category} / v${selectedAgent.version}`;
  const title = document.createElement("h2");
  title.textContent = selectedAgent.name;
  const description = document.createElement("p");
  description.textContent = selectedAgent.description;
  const metadata = document.createElement("div");
  metadata.className = "metadata";
  const values = [
    ["Agent ID", selectedAgent.id],
    ["Runtime", "Deterministic simulation"],
    ["Status", selectedAgent.enabled ? "Enabled" : "Disabled"],
    ["Compatible sites", selectedAgent.supportedSites.join(", ")],
    ["Default appearance", `${selectedAgent.configuration.theme}, ${selectedAgent.configuration.position}`],
    ["External services", selectedAgent.requiredServices.length ? selectedAgent.requiredServices.join(", ") : "None"]
  ];
  for (const [label, value] of values) {
    const cell = document.createElement("div");
    const key = document.createElement("span");
    key.textContent = label;
    const content = document.createElement("strong");
    content.textContent = value;
    cell.append(key, content);
    metadata.append(cell);
  }
  const heading = document.createElement("h3");
  heading.textContent = "Capabilities";
  const list = document.createElement("ul");
  list.className = "capability-list";
  for (const capability of selectedAgent.capabilities) {
    const item = document.createElement("li");
    item.textContent = capability;
    list.append(item);
  }
  detail.append(eyebrow, title, description, metadata, heading, list);
  container.append(detail);
  const messages = $("#preview-messages");
  messages.replaceChildren();
  addMessage(messages, selectedAgent.configuration.welcomeMessage, "assistant");
  $("#preview-input").disabled = !selectedAgent.enabled;
  $("#preview-form").querySelector("button").disabled = !selectedAgent.enabled;
}

function renderInstall() {
  const site = sites.find((candidate) => candidate.id === $("#site-select").value) ?? sites[0];
  const compatible = agents.filter((agent) =>
    site.allowedAgentIds.includes(agent.id) && agent.supportedSites.includes(site.id)
  );
  const chosen = compatible.find((agent) => agent.id === $("#agent-select").value)
    ?? compatible.find((agent) => agent.id === site.defaultAgentId)
    ?? compatible[0];
  const agentSelect = $("#agent-select");
  const oldValue = agentSelect.value;
  agentSelect.replaceChildren(...compatible.map((agent) => {
    const option = document.createElement("option");
    option.value = agent.id;
    option.textContent = agent.name;
    return option;
  }));
  if (compatible.some((agent) => agent.id === oldValue)) agentSelect.value = oldValue;
  else if (chosen) agentSelect.value = chosen.id;
  const agent = compatible.find((candidate) => candidate.id === agentSelect.value);
  const enabled = $("#enabled-select").value === "enabled";
  const warning = $("#deployment-warning");
  warning.classList.toggle("ready", Boolean(widgetUrl));
  warning.textContent = widgetUrl
    ? `Widget artifact URL configured: ${widgetUrl}. Confirm it is the stable production artifact after deployment.`
    : "Widget URL is not configured. Snippet generation and copying stay unavailable until PUBLIC_WIDGET_URL is set to the deployed stable HTTPS widget URL and the app is rebuilt.";
  $("#widget-url-status").textContent = widgetUrl || "not configured; no live URL is assumed";
  const siteUrl = site.publicUrl || (widgetUrl && site.deploymentPath
    ? new URL(site.deploymentPath, widgetUrl).href
    : "");
  $("#site-url-status").textContent = siteUrl || "not configured";
  const siteLink = $("#open-site-link");
  if (siteUrl) {
    siteLink.href = siteUrl;
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.hidden = false;
  } else {
    siteLink.removeAttribute("href");
    siteLink.hidden = true;
  }
  $("#selection-status").textContent = agent
    ? `${site.id} + ${agent.id}${enabled ? " (enabled in generated snippet)" : " (disabled; no widget script will launch)"}`
    : `${site.id} + no compatible agent`;
  const code = $("#snippet");
  const copy = $("#copy-button");
  copy.disabled = !widgetUrl || !enabled || !agent;
  if (!enabled) {
    code.textContent = "<!-- This selection is disabled. Remove the widget script from the host page. -->";
  } else if (!widgetUrl) {
    code.textContent = "Snippet unavailable until a stable deployed HTTPS widget URL is configured.";
  } else if (agent) {
    try {
      code.textContent = buildInstallSnippet({
        siteId: site.id,
        agentId: agent.id,
        scriptUrl: widgetUrl,
        configuration: {
          theme: $("#theme-select").value,
          position: $("#position-select").value
        }
      });
    } catch (error) {
      code.textContent = `Unable to generate snippet: ${error.message}`;
      copy.disabled = true;
    }
  } else {
    code.textContent = "No compatible enabled agent is registered for this site.";
  }
  const steps = $("#install-steps");
  steps.replaceChildren();
  for (const text of [
    `Publish the ${site.name} site over HTTPS. Its stable URL is not configured in this repository.`,
    widgetUrl ? `Add the snippet to the target page using ${widgetUrl}.` : "Deploy the widget, set PUBLIC_WIDGET_URL to its stable HTTPS artifact URL, and rebuild.",
    `Use site ID ${site.id} and only an agent listed for that site.`,
    "Open the host page in a private window; use the launcher and send a non-sensitive demo question.",
    "Check the browser Network panel and JavaScript console. This local simulation requires no API connection."
  ]) {
    const item = document.createElement("li");
    item.textContent = text;
    steps.append(item);
  }
  $("#copy-status").textContent = "";
}

$("#search").addEventListener("input", renderAgentList);
$("#preview-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedAgent?.enabled) return;
  const input = $("#preview-input");
  const text = input.value.trim();
  if (!text) return;
  const messages = $("#preview-messages");
  addMessage(messages, text, "user");
  previewHistory.push({ role: "user", content: text });
  input.value = "";
  const response = simulationRuntime.respond({
    agentId: selectedAgent.id,
    input: text,
    history: previewHistory
  });
  addMessage(messages, response, "assistant");
  previewHistory.push({ role: "assistant", content: response });
});
for (const selector of ["#site-select", "#agent-select", "#theme-select", "#position-select", "#enabled-select"]) {
  $(selector).addEventListener("change", renderInstall);
}
$("#copy-button").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#snippet").textContent);
    $("#copy-status").textContent = "Snippet copied. Paste it into the target page's HTML.";
  } catch {
    $("#copy-status").textContent = "Clipboard access failed. Select the snippet above and copy it manually.";
  }
});

$("#site-select").replaceChildren(...sites.map((site) => {
  const option = document.createElement("option");
  option.value = site.id;
  option.textContent = site.name;
  return option;
}));
const initialSite = sites.find((site) => site.defaultAgentId === selectedAgent?.id) ?? sites[0];
$("#site-select").value = initialSite.id;
renderStats();
renderAgentList();
renderAgentDetail();
renderInstall();
