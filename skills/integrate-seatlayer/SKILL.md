---
name: integrate-seatlayer
description: Add, review, diagnose, or verify SeatLayer integrations inside existing applications. Use for managed hosted booking, direct links, embeds, Organizer Websites, Buyer SDK installation, SeatPicker or SeatingChart, mobile SDKs, server SDKs, custom checkout, holds, private or partner sales, buyer access sessions, channels, workspaces, Embedded Designer or control room, webhooks, analytics, checkout recovery, go-live review, and SeatLayer-related code generation or troubleshooting.
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
3. Determine whether SeatLayer managed ticketing or the host platform owns
   payment, commercial orders, tickets, refunds, and fulfilment.
4. Run the read-only doctor when Node.js is available:

   ```bash
   node <skill-root>/scripts/doctor.mjs <repository-root>
   ```

5. State the chosen commerce profile, SeatLayer surface, and discovered host locations before
   editing.
6. Ask only for business decisions that cannot be discovered safely.

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

Choose the commerce profile first:

- Managed ticketing when SeatLayer owns hosted checkout, Orders, tickets,
  delivery, refunds, and Door. Use a Hosted Event Page, managed embed, or
  Organizer Website. Do not add a host booking endpoint.
- Platform/custom commerce when the host owns payment, orders, tickets,
  refunds, and fulfilment. Use `SeatPicker` for checkout handoff or
  `SeatingChart` for headless selection, then book from a trusted server.
- Private or partner distribution when access is limited by allocation. Choose
  a hosted access link or an origin-bound buyer access session based on the live
  channel contract; private means no public link, not disabled inventory.

Then add only the required surface:

- Official mobile SDK for React Native, Flutter, iOS, or Android buyer apps.
- Official server SDK for the host backend language; prefer it over handwritten
  HTTP when it supports the required operation.
- Embedded Designer for organizer chart editing.
- `SeatManager` for an embedded operator board.
- Workspaces and server APIs for multi-tenant platforms.
- Designer MCP only for authorized chart authoring or review.

Do not choose a larger surface because it is easier to demonstrate.

## Preserve the trust boundary

Implement the invariants for the selected profile:

1. A chart is reusable geometry; each event has independent live inventory.
2. Managed hosted checkout completes booking itself; never book the same buyer
   journey again from host code.
3. In platform/custom commerce, the browser selects and holds while a trusted
   server inspects and books.
4. `SEATLAYER_SECRET_KEY` and every server SDK are server-only.
5. Browser prices are never trusted payment input in custom commerce.
6. Use a stable host order id as `bookingRef` and reuse it for retries.
7. Treat expired holds and HTTP `409` inventory conflicts as normal recovery
   paths.
8. Define the payment-success/booking-failure recovery policy explicitly.
9. Keep buyer access tokens in memory and bind them to the exact event and
   origin; never log, persist, or place them in URLs.
10. Require a short audit reason for privileged channel overrides.
11. Verify webhook signatures from the raw body and deduplicate occurrences.

Do not log or return secret keys, raw credentials, full authorization headers,
or webhook secrets.

## Implement in repository order

For managed hosted checkout:

1. Confirm managed-event readiness, gateway mode, and the chosen distribution
   surface.
2. Add the link, managed embed, or Website placement within the existing UI.
3. Verify hosted payment, branded return, Orders, ticket delivery, loading,
   mobile, and accessibility behavior in test mode.

For platform/custom commerce:

1. Add environment validation and the official server SDK server-side.
2. Add hold inspection, trusted pricing, order coordination, and idempotent
   booking.
3. Add the buyer SDK surface within the existing UI and design system.
4. Add expired-hold, conflict, loading, empty, mobile, and keyboard behavior.

For private or partner access, additionally add entitlement, channel scope,
short-lived token refresh or hosted-link lifecycle, exact-origin enforcement,
revocation, and attribution. Add webhooks, analytics, or operator surfaces only
when required by scope. Document production variable names without values.

Keep browser-to-server payloads small and typed. The opaque `holdId` and stable
host order identity should cross the boundary; trusted pricing and booking
authority should not.

## Verify before handoff

Read [references/verification.md](references/verification.md), then run the
repository's typecheck, unit tests, lint, production build, and relevant
integration tests.

Prove only the behavior belonging to the selected profile. For managed hosted
checkout, verify the hosted purchase and return journey without adding a host
booking assertion. For custom commerce, verify select → hold → inspect →
pay/order → book, expiry, conflicts, idempotent retry, and compensation. For
private access, also verify wrong-origin, expired, revoked, and exhausted access
without silently widening to public inventory.

Always prove no secret or server SDK enters a buyer bundle, buyer access tokens
are not persisted or logged, and mobile and keyboard behavior remains operable.

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
