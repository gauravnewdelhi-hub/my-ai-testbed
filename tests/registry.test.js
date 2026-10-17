import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  agents,
  buildInstallSnippet,
  getRegistryErrors,
  resolveConfiguration,
  sites
} from "../packages/agent-registry/registry.js";
import { simulateReply } from "../packages/agent-registry/simulation.js";

test("registry contains unique, internally consistent demo agents and sites", () => {
  assert.deepEqual(getRegistryErrors(), []);
  assert.equal(agents.length, 4);
  assert.equal(sites.length, 3);
  for (const agent of agents) assert.ok(agents.some((candidate) => candidate.id === agent.id));
});

test("only enabled agent/site assignments resolve", () => {
  assert.equal(resolveConfiguration("northstar-home-demo", "Home Services-demo").ok, true);
  assert.equal(resolveConfiguration("missing-site", "Home Services-demo").ok, false);
  assert.equal(resolveConfiguration("", "Home Services-demo").reason.includes("data-site-id"), true);
  assert.equal(resolveConfiguration("northstar-home-demo", "").reason.includes("data-agent-id"), true);
  assert.equal(resolveConfiguration("northstar-home-demo", "missing-agent").ok, false);
  assert.equal(resolveConfiguration("northstar-home-demo", "shopping-assistant-demo").ok, false);
  const agent = agents.find((candidate) => candidate.id === "Home Services-demo");
  agent.enabled = false;
  assert.equal(resolveConfiguration("northstar-home-demo", "Home Services-demo").reason.includes("disabled"), true);
  agent.enabled = true;
  const site = sites.find((candidate) => candidate.id === "northstar-home-demo");
  site.enabled = false;
  assert.equal(resolveConfiguration("northstar-home-demo", "Home Services-demo").ok, false);
  site.enabled = true;
});

test("snippet includes the configured identifiers, HTTPS URL and appearance", () => {
  const snippet = buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "Home Services-demo",
    scriptUrl: "https://widget.example.org/packages/agent-sdk/widget.js",
    configuration: { theme: "green", position: "left" }
  });
  assert.match(snippet, /data-site-id="northstar-home-demo"/);
  assert.match(snippet, /data-agent-id="Home Services-demo"/);
  assert.match(snippet, /https:\/\/widget\.example\.org\/packages\/agent-sdk\/widget\.js/);
  assert.match(snippet, /data-position="left"/);
  const escaped = buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "Home Services-demo",
    scriptUrl: "https://widget.example.org/packages/agent-sdk/widget.js",
    configuration: { title: 'Say "hi" <x>', welcome: "<img src=x onerror=alert(1)>" }
  });
  assert.match(escaped, /data-title="Say &quot;hi&quot; &lt;x>/);
  assert.match(escaped, /data-welcome="&lt;img src=x onerror=alert\(1\)>"/);
  assert.doesNotMatch(escaped, /<img/);
  assert.throws(() => buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "Home Services-demo",
    scriptUrl: "http://widget.example.org/widget.js"
  }), /HTTPS/);
  assert.throws(() => buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "Home Services-demo",
    scriptUrl: "https://widget.example.org/widget.js"
  }), /HTTPS/);
  assert.throws(() => buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "Home Services-demo",
    scriptUrl: "https://user:pass@widget.example.org/packages/agent-sdk/widget.js"
  }), /HTTPS/);
  assert.throws(() => buildInstallSnippet({
    siteId: "northstar-home-demo",
    agentId: "shopping-assistant-demo",
    scriptUrl: "https://widget.example.org/widget.js"
  }), /not configured/);
});

test("messages receive contextual simulation and safety responses", () => {
  assert.match(simulateReply("Home Services-demo", "urgent emergency"), /cannot dispatch/);
  assert.match(simulateReply("shopping-assistant-demo", "shipping times"), /fictional/);
  assert.match(simulateReply("legal-intake-demo", "Can I get legal advice?"), /not legal advice/);
  assert.match(simulateReply("general-assistant-demo", "hello"), /Hello/);
  assert.equal(simulateReply("general-assistant-demo", "  "), "Please enter a question.");
});

test("widget source stays browser-local and uses safe isolated rendering", async () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const source = await readFile(path.join(root, "packages/agent-sdk/widget.js"), "utf8");
  assert.match(source, /attachShadow\(\{ mode: "open" \}\)/);
  assert.match(source, /item\.textContent = text/);
  assert.match(source, /document\.addEventListener\("DOMContentLoaded"/);
  assert.doesNotMatch(source, /\.innerHTML\b|\.outerHTML\b|\beval\s*\(|\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/);
});
