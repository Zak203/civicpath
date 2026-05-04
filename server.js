const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const publicRoot = path.join(root, "public");
const host = "127.0.0.1";
const preferredPort = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json"
};

function resolveRequestPath(url) {
  const requestPath = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const cleanPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");

  if (cleanPath === "/" || cleanPath === ".") {
    return path.join(root, "index.html");
  }

  if (cleanPath.startsWith("/screens/")) {
    return path.join(publicRoot, cleanPath);
  }

  return path.join(root, cleanPath);
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Cache-Control": extension === ".png" ? "public, max-age=3600" : "no-cache",
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });
    response.end(data);
  });
}

function createServer() {
  return http.createServer((request, response) => {
    const filePath = resolveRequestPath(request.url);

    if (!filePath.startsWith(root)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    sendFile(response, filePath);
  });
}

function listen(port) {
  const server = createServer();

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, host, () => {
    console.log(`CivicPath POC running at http://localhost:${port}`);
  });
}

listen(preferredPort);
