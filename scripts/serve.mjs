import { createReadStream } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = {
  "home-services": "index.html",
  "ecom-store": "apps/ecom-store/public/index.html",
  "legal-portal": "apps/legal-portal/public/index.html",
  "widget-harness": "apps/widget-harness/public/index.html"
};
const appId = process.argv[2];
if (!(appId in routes)) throw new Error(`Unknown app "${appId}".`);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};
const port = ({ "home-services": 4173, "ecom-store": 4174, "legal-portal": 4175, "widget-harness": 4176 })[appId];

const server = createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Invalid URL");
    return;
  }
  let relative = pathname === "/" ? routes[appId] : pathname.replace(/^\/+/, "");
  if (pathname.startsWith("/assets/")) {
    relative = path.join("apps", appId, "public", pathname.slice(1));
  } else if (pathname === "/test-page.html" && appId === "widget-harness") {
    relative = path.join("apps", appId, "public", "test-page.html");
  }
  const target = path.resolve(root, relative);
  if (!target.startsWith(`${root}${path.sep}`) && target !== path.join(root, "index.html")) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const details = await stat(target);
    const file = details.isDirectory() ? path.join(target, "index.html") : target;
    await access(file);
    response.writeHead(200, {
      "Content-Type": mime[path.extname(file)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    });
    if (path.extname(file) === ".html") {
      const html = (await readFile(file, "utf8")).replaceAll("__PUBLIC_WIDGET_URL__", process.env.PUBLIC_WIDGET_URL ?? "");
      response.end(html);
    } else {
      createReadStream(file).pipe(response);
    }
  } catch {
    response.writeHead(404).end("Not found");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`${appId} demo: http://127.0.0.1:${port}/`);
});
