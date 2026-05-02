#!/usr/bin/env node
/**
 * Production `next start` helper:
 * - If PORT is set, use it exactly (hosting / Docker).
 * - Otherwise prefer 3001+ (3000 is usually taken by `next dev`) and scan until a port is free.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import net from "node:net";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

function probePort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE" || err.code === "EACCES") resolve(false);
      else reject(err);
    });
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

async function resolvePort() {
  if (process.env.PORT != null && process.env.PORT !== "") {
    const p = Number(process.env.PORT);
    if (!Number.isFinite(p) || p <= 0 || p > 65535) {
      console.error("Invalid PORT:", process.env.PORT);
      process.exit(1);
    }
    return p;
  }

  const rangeStart = 3001;
  const rangeEnd = 3099;
  for (let port = rangeStart; port <= rangeEnd; port++) {
    if (await probePort(port)) return port;
  }
  console.error(`No free TCP port found between ${rangeStart} and ${rangeEnd}.`);
  process.exit(1);
}

const port = await resolvePort();

if (process.env.PORT == null || process.env.PORT === "") {
  console.error(`▲ Production server (no PORT set): http://localhost:${port}`);
}

const result = spawnSync(process.execPath, [nextBin, "start", "-p", String(port)], {
  stdio: "inherit",
});

process.exit(result.status === null ? 1 : result.status);
