import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agents, getRegistryErrors, sites } from "../packages/agent-registry/registry.js";
import { simulateReply } from "../packages/agent-registry/simulation.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apps = ["widget-harness", "ecom-store", "legal-portal", "home-services"];
const errors = getRegistryErrors();
if (errors.length) throw new Error(errors.join("\n"));
if (agents.length !== 4 || agents.some((agent) => !agent.enabled || !agent.simulation)) {
  throw new Error("Expected exactly four enabled simulation agents.");
}
for (const agent of agents) {
  for (const siteId of agent.supportedSites) {
    if (!sites.some((site) => site.id === siteId && site.allowedAgentIds.includes(agent.id))) {
      throw new Error(`Broken site assignment for ${agent.id} on ${siteId}`);
    }
  }
}
if (!simulateReply("home-services-assistant-demo", "urgent furnace emergency").includes("cannot dispatch")) {
  throw new Error("Emergency simulation safety response is missing.");
}
if (!simulateReply("legal-intake-demo", "Can you give legal advice?").includes("not legal advice")) {
  throw new Error("Legal simulation disclaimer is missing.");
}
for (const app of apps) {
  const output = path.join(root, "apps", app, "dist");
  await access(path.join(output, "index.html"));
  await access(path.join(output, "packages/agent-sdk/widget.js"));
  await access(path.join(output, "packages/agent-registry/registry.js"));
  const pagePath = path.join(output, app === "widget-harness" ? "test-page.html" : "index.html");
  const html = await readFile(pagePath, "utf8");
  if (!html.includes("/packages/agent-sdk/widget.js")) throw new Error(`Widget not wired in ${app}`);
  if (html.includes("__PUBLIC_WIDGET_URL__")) throw new Error(`Unresolved build token in ${app}`);
}
const siteOutput = path.join(root, "dist");
for (const file of [
  "index.html",
  "console/index.html",
  "console/test-page.html",
  "store/index.html",
  "legal/index.html",
  "packages/agent-sdk/widget.js",
  "packages/agent-registry/registry.js",
  "docs/DEPLOYMENT_GUIDE.md"
]) {
  await access(path.join(siteOutput, file));
}
for (const [page, asset] of [
  ["console/index.html", "console/assets/console.css"],
  ["store/index.html", "store/assets/site.css"],
  ["legal/index.html", "legal/assets/site.css"]
]) {
  const html = await readFile(path.join(siteOutput, page), "utf8");
  if (!html.includes(`/${asset}`)) throw new Error(`Unified path rewrite missing in ${page}`);
}
async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(file));
    else files.push(file);
  }
  return files;
}
for (const output of [...apps.map((app) => path.join(root, "apps", app, "dist")), siteOutput]) {
  const files = await collectFiles(output);
  if (files.some((file) => path.basename(file).startsWith(".env"))) {
    throw new Error(`Environment file copied into public build: ${output}`);
  }
  for (const file of files.filter((name) => /\.(?:html|js|css|json|md)$/.test(name))) {
    const source = await readFile(file, "utf8");
    if (/\b(?:sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,})|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/.test(source)) {
      throw new Error(`Possible secret in public build: ${path.relative(root, file)}`);
    }
  }
}
console.log(`Build artifacts checked for ${apps.length} independent apps and unified site; ${agents.length} agents and ${sites.length} sites validated.`);
