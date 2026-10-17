import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const apps = [
  ["home-services", ""],
  ["widget-harness", "console"],
  ["ecom-store", "store"],
  ["legal-portal", "legal"]
];
for (const [app, prefix] of apps) {
  const builtApp = path.join(root, "apps", app, "dist");
  const destination = prefix ? path.join(output, prefix) : output;
  await cp(builtApp, destination, { recursive: true });
  if (prefix) {
    const page = path.join(destination, "index.html");
    const html = await readFile(page, "utf8");
    const prefixAssets = (value) => value.replaceAll('="/assets/', `="/${prefix}/assets/`);
    await writeFile(page, prefixAssets(html));
  }
}
await cp(path.join(root, "docs"), path.join(output, "docs"), { recursive: true });
console.log(`Built unified static site: ${path.relative(root, output)}`);
