#!/usr/bin/env node
// PreToolUse hook for Write, Edit and MultiEdit. Informational only: it never
// blocks or approves a tool call. When the proposed change touches SeatLayer
// code, it adds a short reminder to the assistant's context; otherwise it
// prints nothing.

import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SEATLAYER_PATTERN =
  /@seatlayer\/|SEATLAYER_[A-Z0-9_]+|api\.seatlayer\.io|cdn\.seatlayer\.io|\bseatlayer\b/i;

export const REMINDER =
  "This change touches SeatLayer code. Use the integrate-seatlayer skill and load the " +
  "focused Markdown page from https://docs.seatlayer.io/llms.txt before relying on an " +
  "SDK method, endpoint, error code or webhook name. Choose the commerce owner first: " +
  "Hosted Ticketing books by itself, so do not add a host booking call; in a " +
  "Platform/SDK integration the browser holds and a trusted server inspects and books " +
  "with a stable bookingRef. Keep SEATLAYER_SECRET_KEY and server SDKs out of client " +
  "code, keep buyer access tokens out of storage, URLs and logs, back off on 429 using " +
  "Retry-After, and rerun the SeatLayer doctor after the change.";

export function proposedText(input) {
  const tool = input?.tool_input ?? {};
  const parts = [tool.file_path, tool.content, tool.new_string];
  if (Array.isArray(tool.edits)) {
    for (const edit of tool.edits) parts.push(edit?.new_string);
  }
  return parts.filter((part) => typeof part === "string").join("\n");
}

export function reminderFor(input) {
  if (!SEATLAYER_PATTERN.test(proposedText(input))) return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: REMINDER,
    },
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}

if (isDirectExecution()) {
  try {
    const output = reminderFor(JSON.parse(await readStdin()));
    if (output) process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch {
    // Never interfere with an edit because the hook input was unexpected.
  }
  process.exitCode = 0;
}
