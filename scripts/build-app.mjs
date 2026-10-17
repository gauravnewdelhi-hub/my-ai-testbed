import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appId = process.argv[2];
const appDirectory = path.join(root, "apps", appId ?? "");
const knownApps = new Set(["widget-harness", "ecom-store", "legal-portal", "home-services"]);
if (!knownApps.has(appId)) {
  throw new Error(`Unknown app "${appId}". Choose one of: ${[...knownApps].join(", ")}`);
}
let widgetUrl = process.env.PUBLIC_WIDGET_URL;
if (widgetUrl === undefined) {
  try {
    const localConfig = await readFile(path.join(root, ".env"), "utf8");
    const setting = localConfig.match(/^PUBLIC_WIDGET_URL\s*=\s*(.*)$/m)?.[1];
    if (setting !== undefined) {
      widgetUrl = setting.trim();
      if ((widgetUrl.startsWith('"') && widgetUrl.endsWith('"')) ||
          (widgetUrl.startsWith("'") && widgetUrl.endsWith("'"))) {
        widgetUrl = widgetUrl.slice(1, -1);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
widgetUrl = widgetUrl?.trim() ?? "";
if (widgetUrl) {
  let parsed;
  try {
    parsed = new URL(widgetUrl);
  } catch {
    throw new Error("PUBLIC_WIDGET_URL must be an absolute HTTPS URL.");
  }
  if (parsed.protocol !== "https:" || ["localhost", "127.0.0.1"].includes(parsed.hostname) ||
      parsed.username || parsed.password || parsed.search || parsed.hash ||
      !parsed.pathname.endsWith("/packages/agent-sdk/widget.js")) {
    throw new Error("PUBLIC_WIDGET_URL must be a stable, public HTTPS URL.");
  }
}
const output = path.join(appDirectory, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
if (appId === "home-services") {
  await cp(path.join(root, "index.html"), path.join(output, "index.html"));
  await cp(path.join(appDirectory, "public"), output, { recursive: true });
} else {
  await cp(path.join(appDirectory, "public"), output, { recursive: true });
}
await cp(path.join(root, "packages"), path.join(output, "packages"), {
  recursive: true,
  filter: (source) => !source.includes(`${path.sep}node_modules${path.sep}`)
});
await cp(path.join(root, "docs"), path.join(output, "docs"), { recursive: true });
for (const file of ["index.html", "test-page.html"]) {
  const filePath = path.join(output, file);
  try {
    const html = await readFile(filePath, "utf8");
    await writeFile(filePath, html.replaceAll("__PUBLIC_WIDGET_URL__", widgetUrl));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
console.log(`Built ${appId}: ${path.relative(root, output)}`);
