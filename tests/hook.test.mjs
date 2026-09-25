import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { REMINDER, reminderFor } from "../hooks/seatlayer-edit-reminder.mjs";

const hookPath = fileURLToPath(new URL("../hooks/seatlayer-edit-reminder.mjs", import.meta.url));

function runHook(input) {
  return spawnSync(process.execPath, [hookPath], { input, encoding: "utf8" });
}

test("adds context, and no decision, when a Write touches SeatLayer code", () => {
  const output = reminderFor({
    tool_name: "Write",
    tool_input: { file_path: "src/checkout.ts", content: 'import { SeatPicker } from "@seatlayer/js";' },
  });
  assert.deepEqual(output, {
    hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: REMINDER },
  });
});

test("detects SeatLayer in Edit and MultiEdit new text", () => {
  assert.ok(reminderFor({ tool_input: { file_path: "a.py", new_string: "os.environ['SEATLAYER_SECRET_KEY']" } }));
  assert.ok(reminderFor({ tool_input: { file_path: "a.ts", edits: [{ new_string: "https://api.seatlayer.io/v1" }] } }));
});

test("stays silent for unrelated edits", () => {
  assert.equal(reminderFor({ tool_input: { file_path: "src/app.ts", content: "export const x = 1;" } }), null);
});

test("prints valid JSON or nothing, and always exits 0", () => {
  const touched = runHook(JSON.stringify({ tool_input: { file_path: "seatlayer.ts", content: "x" } }));
  assert.equal(touched.status, 0);
  assert.equal(JSON.parse(touched.stdout).hookSpecificOutput.hookEventName, "PreToolUse");

  const unrelated = runHook(JSON.stringify({ tool_input: { file_path: "a.ts", content: "x" } }));
  assert.equal(unrelated.status, 0);
  assert.equal(unrelated.stdout, "");

  const malformed = runHook("not json");
  assert.equal(malformed.status, 0);
  assert.equal(malformed.stdout, "");
});
