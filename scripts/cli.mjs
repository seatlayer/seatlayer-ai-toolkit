#!/usr/bin/env node

import { runDoctorCli } from "../skills/integrate-seatlayer/scripts/doctor.mjs";
import { installSkill } from "./install.mjs";

const [command, ...args] = process.argv.slice(2);

if (command === "doctor") {
  await runDoctorCli(args);
} else if (command === "install") {
  try {
    await installSkill(args);
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
} else if (command === "verify") {
  const target = args.find((argument) => !argument.startsWith("--")) ?? ".";
  await runDoctorCli([target, "--strict"]);
  if (!process.exitCode) {
    process.stdout.write(
      "\nStatic checks passed. Complete the test-mode behavior matrix in skills/integrate-seatlayer/references/verification.md.\n",
    );
  }
} else {
  process.stdout.write(`SeatLayer AI Toolkit

Usage:
  seatlayer-ai doctor [repository] [--json] [--strict]
  seatlayer-ai verify [repository]
  seatlayer-ai install --target codex|claude|github [--project path] [--force]
`);
}
