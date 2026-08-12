---
description: Diagnose SeatLayer integration safety, correctness, and launch-readiness problems
argument-hint: "[symptom, security, or pre-launch]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch
---

# SeatLayer Doctor

Use the `integrate-seatlayer` skill and inspect the repository before
reporting.

Run:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/doctor.mjs" . --json
```

Use `$ARGUMENTS` to prioritize the investigation. Correlate deterministic
findings with the host architecture and focused live documentation. Do not
declare a finding from a filename or keyword alone.

Report:

- critical issues, warnings, and confirmed passes;
- exact file and line evidence;
- the violated SeatLayer trust boundary;
- the selected or inferred commerce profile and whether the architecture mixes
  hosted and custom booking responsibilities;
- a focused remediation;
- automated versus manual verification; and
- whether the integration is ready for test mode or production.

Do not modify files unless the user asks for fixes.
