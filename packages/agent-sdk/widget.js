import { resolveConfiguration } from "../agent-registry/registry.js";
import { simulationRuntime } from "../agent-registry/simulation.js";

const rootKey = "__agentTestbedWidgetRoots";
const styles = `
  :host { all: initial; color: #14251f; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  *, *::before, *::after { box-sizing: border-box; }
  .widget { --accent: #23634e; position: fixed; z-index: 2147483000; bottom: 20px; right: 20px; font-size: 14px; }
  .widget.left { right: auto; left: 20px; }
  button, textarea { font: inherit; }
  button { cursor: pointer; }
  button:focus-visible, textarea:focus-visible { outline: 3px solid #e7aa39; outline-offset: 2px; }
  .launcher { width: 58px; height: 58px; border: 0; border-radius: 50%; color: #fff; background: var(--accent); box-shadow: 0 5px 20px #0003; font-size: 25px; }
  .panel { position: absolute; bottom: 72px; right: 0; display: flex; flex-direction: column; width: min(360px, calc(100vw - 32px)); height: min(500px, calc(100dvh - 112px)); overflow: hidden; border: 1px solid #d8e1dc; border-radius: 16px; background: #fff; box-shadow: 0 12px 42px #10251e30; }
  .panel[hidden] { display: none; }
  .left .panel { right: auto; left: 0; }
  .header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; color: #fff; background: var(--accent); }
  .heading { min-width: 0; }
  .heading strong { display: block; overflow: hidden; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
  .heading span { display: block; margin-top: 3px; opacity: .9; font-size: 11px; }
  .close { width: 34px; height: 34px; border: 1px solid #ffffff88; border-radius: 9px; color: inherit; background: transparent; font-size: 20px; }
  .messages { flex: 1; overflow-y: auto; padding: 14px; background: #f5f8f6; }
  .message { max-width: 88%; margin: 0 0 10px; padding: 10px 12px; border-radius: 12px; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; }
  .assistant { border: 1px solid #e2e9e4; background: #fff; }
  .visitor { margin-left: auto; color: #fff; background: var(--accent); }
  .notice { padding: 8px 12px; color: #5c6a62; background: #fff; font-size: 11px; line-height: 1.4; }
  .composer { display: flex; align-items: end; gap: 8px; padding: 10px; border-top: 1px solid #e1e8e3; background: #fff; }
  textarea { flex: 1; min-height: 40px; max-height: 100px; resize: vertical; padding: 10px; border: 1px solid #bdcac1; border-radius: 9px; color: #14251f; background: #fff; }
  .send { min-height: 40px; padding: 0 14px; border: 0; border-radius: 9px; color: #fff; background: var(--accent); font-weight: 700; }
  .status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  @media (max-width: 480px) { .widget { bottom: 12px; right: 12px; } .widget.left { left: 12px; } .panel { position: fixed; inset: auto 8px 80px; width: auto; height: min(520px, calc(100dvh - 100px)); } .left .panel { left: 8px; } }
`;

function report(message, development) {
  if (development) console.warn(`[AI Agent widget] ${message}`);
}

function makeMessage(document, container, text, className) {
  const item = document.createElement("div");
  item.className = `message ${className}`;
  item.textContent = text;
  container.append(item);
  container.scrollTop = container.scrollHeight;
  return item;
}

function mount(script) {
  const document = script.ownerDocument;
  const siteId = script.dataset.siteId;
  const agentId = script.dataset.agentId;
  const resolved = resolveConfiguration(siteId, agentId);
  if (!resolved.ok) {
    report(resolved.reason, script.dataset.development === "true");
    return;
  }
  const registry = window[rootKey] ??= new Set();
  const key = `${siteId}:${agentId}`;
  if (registry.has(key)) return;
  registry.add(key);

  const host = document.createElement("div");
  host.setAttribute("data-agent-testbed-widget", "");
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const wrapper = document.createElement("div");
  wrapper.className = "widget";
  if (script.dataset.position === "left") wrapper.classList.add("left");
  const theme = script.dataset.theme ?? resolved.agent.configuration.theme;
  const colors = { green: "#23634e", blue: "#245d8c", navy: "#273b62", slate: "#475569" };
  wrapper.style.setProperty("--accent", colors[theme] ?? colors[resolved.agent.configuration.theme]);

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "launcher";
  launcher.setAttribute("aria-label", `Open ${script.dataset.title || resolved.agent.configuration.title}`);
  launcher.setAttribute("aria-expanded", "false");
  launcher.textContent = "✦";
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", script.dataset.title || resolved.agent.configuration.title);
  const header = document.createElement("div");
  header.className = "header";
  const heading = document.createElement("div");
  heading.className = "heading";
  const title = document.createElement("strong");
  title.textContent = script.dataset.title || resolved.agent.configuration.title;
  const label = document.createElement("span");
  label.textContent = "SIMULATED · messages stay in this browser";
  heading.append(title, label);
  const close = document.createElement("button");
  close.type = "button";
  close.className = "close";
  close.setAttribute("aria-label", "Close chat");
  close.textContent = "×";
  header.append(heading, close);
  const messages = document.createElement("div");
  messages.className = "messages";
  messages.setAttribute("role", "log");
  messages.setAttribute("aria-live", "polite");
  messages.setAttribute("aria-relevant", "additions text");
  const notice = document.createElement("div");
  notice.className = "notice";
  notice.textContent = "Demo only. Do not share personal or confidential information. No message is sent to a server.";
  const composer = document.createElement("form");
  composer.className = "composer";
  const input = document.createElement("textarea");
  input.setAttribute("aria-label", "Your message");
  input.setAttribute("maxlength", "1000");
  input.setAttribute("placeholder", "Ask a demo question");
  input.required = true;
  const send = document.createElement("button");
  send.className = "send";
  send.type = "submit";
  send.textContent = "Send";
  const status = document.createElement("span");
  status.className = "status";
  status.setAttribute("role", "status");
  composer.append(input, send);
  panel.append(header, messages, notice, composer);
  wrapper.append(launcher, panel, status);
  shadow.append(style, wrapper);
  document.body.append(host);

  const welcome = script.dataset.welcome || resolved.agent.configuration.welcomeMessage;
  makeMessage(document, messages, welcome, "message assistant");
  const history = [];
  const setOpen = (open) => {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", `${open ? "Close" : "Open"} ${title.textContent}`);
    if (open) input.focus();
    else launcher.focus();
  };
  launcher.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  });
  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    makeMessage(document, messages, text, "message visitor");
    history.push({ role: "user", content: text });
    input.value = "";
    const reply = simulationRuntime.respond({ agentId, input: text, history });
    makeMessage(document, messages, reply, "message assistant");
    history.push({ role: "assistant", content: reply });
    status.textContent = "Simulated response added.";
  });
}

function initialize() {
  const scripts = document.querySelectorAll("script[data-agent-widget]");
  for (const script of scripts) mount(script);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
