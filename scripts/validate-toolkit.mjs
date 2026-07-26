#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

const packageJson = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);
const codexManifest = JSON.parse(
  await readFile(resolve(root, ".codex-plugin/plugin.json"), "utf8"),
);
const claudeManifest = JSON.parse(
  await readFile(resolve(root, ".claude-plugin/plugin.json"), "utf8"),
);
const marketplace = JSON.parse(
  await readFile(resolve(root, ".claude-plugin/marketplace.json"), "utf8"),
);
const mcp = JSON.parse(await readFile(resolve(root, ".mcp.json"), "utf8"));
const skill = await readFile(
  resolve(root, "skills/integrate-seatlayer/SKILL.md"),
  "utf8",
);
const integrationMap = await readFile(
  resolve(
    root,
    "skills/integrate-seatlayer/references/integration-map.md",
  ),
  "utf8",
);

assert(
  packageJson.version === codexManifest.version &&
    packageJson.version === claudeManifest.version &&
    packageJson.version === marketplace.metadata.version,
  "Package and plugin versions must match",
);
assert(
  codexManifest.name === "seatlayer-ai-toolkit",
  "Unexpected Codex plugin name",
);
assert(claudeManifest.name === "seatlayer", "Unexpected Claude plugin name");
assert(
  /^---\nname: integrate-seatlayer\ndescription: [^\n]+\n---/.test(skill),
  "Skill frontmatter must contain only name and description",
);
assert(
  skill.length < 15_000,
  "SKILL.md is too large; move detail into references",
);
assert(
  mcp.mcpServers?.["seatlayer-designer"]?.url ===
    "https://mcp.seatlayer.io/mcp",
  "Designer MCP URL is missing or incorrect",
);

for (const requiredRoute of [
  "/llms.txt",
  "/agents/integrate-seatlayer/index.md",
  "/examples/complete-checkout/index.md",
  "/integrations/best-practices/index.md",
  "/server-api/booking/index.md",
]) {
  assert(
    integrationMap.includes(`https://docs.seatlayer.io${requiredRoute}`) ||
      skill.includes(`https://docs.seatlayer.io${requiredRoute}`),
    `Missing required live documentation route: ${requiredRoute}`,
  );
}

for (const asset of ["assets/icon.png", "assets/logo.png"]) {
  const details = await stat(resolve(root, asset));
  assert(details.size > 0, `Missing plugin asset: ${asset}`);
}

const files = await walk(root);
for (const file of files) {
  if (!/\.(?:json|md|mjs|yaml|yml)$/.test(file)) continue;
  const content = await readFile(file, "utf8");
  assert(
    !content.includes("[TODO" + ":"),
    `Unresolved placeholder in ${relative(root, file)}`,
  );
}

for (const command of marketplace.plugins[0].commands) {
  await stat(resolve(root, command));
}
for (const skillPath of marketplace.plugins[0].skills) {
  await stat(resolve(root, skillPath));
}

process.stdout.write(
  `✓ toolkit validated: ${files.length} files, version ${packageJson.version}\n`,
);
