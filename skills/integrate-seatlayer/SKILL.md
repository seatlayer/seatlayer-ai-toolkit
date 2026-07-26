---
name: integrate-seatlayer
description: Add, review, diagnose, or verify SeatLayer reserved-seating integrations inside existing applications. Use for Buyer SDK installation, SeatPicker or SeatingChart implementation, server booking, holds, ticket tiers, best-available seats, GA, workspaces, embedded Designer or control room, webhooks, analytics, checkout recovery, go-live review, or SeatLayer-related code generation and troubleshooting.
---

# Integrate SeatLayer

Use the live SeatLayer Markdown documentation as the product source of truth.
Adapt SeatLayer to the repository; do not generate a parallel demo application
unless the user explicitly asks for one.

## Start with repository discovery

1. Read repository agent instructions and contribution guidance.
2. Inspect the package manager, framework, routing, server/client boundary,
   authentication, tenant model, order/payment flow, environment validation,
   HTTP conventions, tests, analytics adapter, and deployment platform.
3. Run the read-only doctor when Node.js is available:

   ```bash
   node <skill-root>/scripts/doctor.mjs <repository-root>
   ```

4. State the chosen SeatLayer surface and the discovered host locations before
   editing.
5. Ask only for business decisions that cannot be discovered safely.

Read [references/integration-map.md](references/integration-map.md) to select
the surface and documentation routes. Read
[references/safety-contract.md](references/safety-contract.md) before changing
checkout, credential, booking, inventory, or webhook code.

## Load focused live documentation

Always begin with:

- `https://docs.seatlayer.io/llms.txt`
- the task-specific Markdown routes selected from `integration-map.md`

Prefer `/<page>/index.md` routes. Use
`https://docs.seatlayer.io/llms-full.txt` only when the task genuinely spans
several product surfaces. Do not invent SDK methods, fields, endpoints, error
codes, or release status from memory.

If live documentation conflicts with this skill, follow the live
documentation and report the discrepancy.

## Choose the smallest complete integration

Use:

- `SeatPicker` for a complete buyer journey with checkout handoff.
- `SeatingChart` for headless selection and a fully custom cart.
- Hosted iframe only for the documented direct-booking boundary.
- Embedded Designer for organizer chart editing.
- `SeatManager` for an embedded operator board.
- Workspaces and server APIs for multi-tenant platforms.
- Designer MCP only for authorized chart authoring or review.

Do not choose a larger surface because it is easier to demonstrate.

## Preserve the trust boundary

Implement these invariants:

1. A chart is reusable geometry; each event has independent live inventory.
2. The browser selects and holds. A trusted server inspects and books.
3. `SEATLAYER_SECRET_KEY` is server-only.
4. Browser prices are never trusted payment input.
5. Use a stable host order id as `bookingRef` and reuse it for retries.
6. Treat expired holds and HTTP `409` inventory conflicts as normal recovery
   paths.
7. Define the payment-success/booking-failure recovery policy explicitly.
8. Verify webhook signatures from the raw body and deduplicate occurrences.

Do not log or return secret keys, raw credentials, full authorization headers,
or webhook secrets.

## Implement in repository order

1. Add environment validation and server-only configuration.
2. Add the server SeatLayer client/helper using the repository's HTTP pattern.
3. Add hold inspection, trusted pricing, order coordination, and idempotent
   booking.
4. Add the buyer surface within the existing UI and design system.
5. Add expired-hold, conflict, loading, empty, mobile, and keyboard behavior.
6. Add webhooks, analytics, or operator surfaces only when required by scope.
7. Document production values without printing secrets.

Keep browser-to-server payloads small and typed. The opaque `holdId` and stable
host order identity should cross the boundary; trusted pricing and booking
authority should not.

## Verify before handoff

Read [references/verification.md](references/verification.md), then run the
repository's typecheck, unit tests, lint, production build, and relevant
integration tests.

At minimum prove:

- successful select → hold → inspect → pay/order → book;
- expired hold before payment;
- inventory conflict;
- duplicate retry with the same `bookingRef`;
- payment failure;
- payment success followed by booking failure;
- missing or mismatched environment credentials;
- no secret in browser output; and
- mobile and keyboard operability.

Run the doctor again after implementation. Distinguish automated checks from
manual verification and report skipped checks.

## Use Designer MCP carefully

When the task involves chart authoring or review, read
[references/designer-mcp.md](references/designer-mcp.md). Begin with
`get_capabilities`, follow the staged semantic workflow, and never publish
without explicit user authorization.

Do not use Designer MCP for ordinary SDK or server integration work.

## Hand off clearly

Return:

- changed files and why;
- selected SeatLayer surface;
- commands and results;
- assumptions and unresolved production configuration;
- environment-variable names without values;
- manual end-to-end steps; and
- follow-up work for webhooks, observability, deployment, or operations.
