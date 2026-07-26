import assert from "node:assert/strict";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { installSkill } from "../scripts/install.mjs";

test("installs the portable skill for GitHub into a project", async () => {
  const project = await mkdtemp(join(tmpdir(), "seatlayer-install-"));

  const destination = await installSkill([
    "--target",
    "github",
    "--project",
    project,
  ]);

  await stat(join(destination, "SKILL.md"));
  await stat(join(destination, "scripts/doctor.mjs"));
  const skill = await readFile(join(destination, "SKILL.md"), "utf8");
  assert.match(skill, /^---\nname: integrate-seatlayer/m);
});
