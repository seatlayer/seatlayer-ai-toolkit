---
description: Plan SeatLayer installation and environment setup for the current repository
argument-hint: "[SeatPicker, SeatingChart, platform, or embedded surface]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch
---

# Set up SeatLayer

Use the `integrate-seatlayer` skill. Inspect the repository and run the doctor
before recommending packages or files.

Identify:

- package manager and framework;
- browser entry point;
- trusted server boundary;
- existing order/payment flow;
- environment validation and secret store;
- test conventions; and
- the commerce owner and smallest SeatLayer surface matching `$ARGUMENTS`;
- whether hosted checkout removes the need for a host booking endpoint; and
- whether private/channel access requires a hosted link or buyer session.

Load the current installation, authentication, and selected-surface Markdown
pages from `https://docs.seatlayer.io`.

Return a repository-specific setup plan with package commands, environment
variable names without values, proposed files, the trust boundary, and
verification steps. Do not edit the project unless the user asks to implement.
