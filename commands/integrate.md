---
description: Implement the smallest complete SeatLayer integration inside the current repository
argument-hint: "[buyer flow, platform surface, or feature]"
allowed-tools: Read, Glob, Grep, Bash, Edit, WebFetch, WebSearch
---

# Integrate SeatLayer

Use the `integrate-seatlayer` skill for this task.

Treat `$ARGUMENTS` as the requested product outcome. Before editing:

1. inspect repository instructions, architecture, checkout, payments,
   environment handling, errors, analytics, and tests;
2. run the toolkit doctor;
3. choose the smallest SeatLayer surface that satisfies the outcome;
4. load `/llms.txt` and the focused live Markdown pages routed by the skill;
5. explain the browser/server boundary and files you intend to change.

Implement within the existing application and design system. Do not build a
parallel demo. Preserve server-only credentials, trusted pricing, stable
`bookingRef`, conflict recovery, and payment/booking compensation.

Run the repository's checks and the skill verification matrix. Return changed
files, evidence, assumptions, manual test steps, and production configuration
still required.
