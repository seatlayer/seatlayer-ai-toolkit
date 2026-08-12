---
description: Verify a SeatLayer integration from static safety checks through the test-mode checkout journey
argument-hint: "[scope or known risk]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch
---

# Verify SeatLayer

Use the `integrate-seatlayer` skill and read its verification reference.

1. Run the toolkit doctor in strict mode.
2. Run the repository's typecheck, unit tests, lint, production build, and
   existing integration/browser tests.
3. Inspect the browser build for server credentials and server-only modules.
4. Identify the selected commerce profile. For managed checkout, trace hosted
   select → payment → Order → ticket → branded return. For custom commerce,
   trace select → hold → server inspect → trusted order/payment → book.
5. Verify only the relevant matrix, including hosted direct/embed/Website
   routing or private wrong-origin/expired/revoked access where applicable.
6. Inspect storage, URLs, logs, analytics, and buyer bundles for secrets, server
   SDKs, buyer access tokens, and hosted capability URLs.

Use test mode for live probes. Do not create production bookings, cancel live
orders, publish charts, or reveal credentials.

Return a pass/fail matrix, commands and results, skipped checks, blockers, and
manual steps still required.
