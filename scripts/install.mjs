#!/usr/bin/env node

import { cp, mkdir, rm, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolkitRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/** Skills this toolkit can install; the first is the default. */
export const SKILLS = ["integrate-seatlayer", "seatlayer-venue-spec"];

function readOption(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function installSkill(args = process.argv.slice(2)) {
  const target = readOption(args, "--target");
  const project = resolve(readOption(args, "--project") ?? process.cwd());
  const force = args.includes("--force");
  const skill = readOption(args, "--skill") ?? SKILLS[0];
  if (!SKILLS.includes(skill)) {
    throw new Error(`Choose --skill ${SKILLS.join(" or --skill ")}.`);
  }

  const destinations = {
    codex: resolve(homedir(), `.codex/skills/${skill}`),
    claude: resolve(homedir(), `.claude/skills/${skill}`),
    github: resolve(project, `.github/skills/${skill}`),
  };

  if (!target || !destinations[target]) {
    throw new Error(
      "Choose --target codex, --target claude, or --target github.",
    );
  }

  const destination = destinations[target];
  if (await exists(destination)) {
    if (!force) {
      throw new Error(
        `Destination already exists: ${destination}\nRerun with --force to replace it.`,
      );
    }
    await rm(destination, { recursive: true, force: true });
  }

  await mkdir(dirname(destination), { recursive: true });
  await cp(resolve(toolkitRoot, "skills", skill), destination, { recursive: true });

  process.stdout.write(
    `Installed ${skill} for ${target}: ${destination}\n`,
  );
  return destination;
}

const isDirectExecution =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectExecution) {
  try {
    await installSkill();
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
