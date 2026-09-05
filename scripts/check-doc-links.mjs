#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceExtensions = new Set([".json", ".md", ".mjs", ".yml", ".yaml"]);
const documentationMcpUrl = "https://docs.seatlayer.io/mcp";

function requestFor(url) {
  const request = {
    headers: { "user-agent": "seatlayer-ai-toolkit-link-check/0.2" },
    signal: AbortSignal.timeout(15_000),
  };

  if (url !== documentationMcpUrl) return request;

  return {
    ...request,
    method: "POST",
    headers: {
      ...request.headers,
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: {
          name: "seatlayer-ai-toolkit-link-check",
          version: "0.2",
        },
      },
    }),
  };
}

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.isFile() && sourceExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const links = new Set();
for (const file of await collect(root)) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/https:\/\/docs\.seatlayer\.io\/[A-Za-z0-9_./-]+/g)) {
    links.add(match[0].replace(/[.)\]}>;,]+$/, ""));
  }
}

const failures = [];
const queue = [...links].sort();
const workers = Array.from({ length: Math.min(5, queue.length) }, async () => {
  while (queue.length > 0) {
    const url = queue.shift();
    try {
      const response = await fetch(url, requestFor(url));
      if (!response.ok) {
        await response.body?.cancel();
        failures.push(`${response.status} ${url}`);
        continue;
      }

      if (url === documentationMcpUrl) {
        const message = await response.json();
        if (
          message?.jsonrpc !== "2.0" ||
          message?.id !== 1 ||
          typeof message?.result?.serverInfo?.name !== "string"
        ) {
          failures.push(`invalid MCP initialize response ${url}`);
        }
      } else {
        await response.body?.cancel();
      }
    } catch (error) {
      failures.push(`${error instanceof Error ? error.message : String(error)} ${url}`);
    }
  }
});

await Promise.all(workers);

if (failures.length > 0) {
  process.stderr.write(`SeatLayer documentation link failures:\n${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`✓ ${links.size} SeatLayer documentation links resolved\n`);
}
