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
4. Trace select → hold → server inspect → trusted order/payment → book.
5. Verify expiry, conflict, duplicate retry, payment failure, payment-success
   booking failure, missing credentials, test/live mismatch, webhook replay,
   mobile, and keyboard behavior.

Use test mode for live probes. Do not create production bookings, cancel live
orders, publish charts, or reveal credentials.

Return a pass/fail matrix, commands and results, skipped checks, blockers, and
manual steps still required.
