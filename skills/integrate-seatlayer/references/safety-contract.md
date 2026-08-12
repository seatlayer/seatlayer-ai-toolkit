# Safety contract

Apply these rules whenever code can affect credentials, prices, holds,
inventory, payments, bookings, cancellations, or webhooks.

## Choose the commerce authority

- In managed ticketing, SeatLayer hosted checkout owns payment, Orders, booking,
  tickets, delivery, refunds, and Door. The host places a Hosted Event Page,
  managed embed, or Organizer Website and must not book the same journey again.
- In platform/custom commerce, the browser may render, select, hold, release,
  and hand off an opaque `holdId`. A trusted host server authorizes the order,
  inspects the hold, calculates the trusted charge, coordinates payment, and
  books.
- Never call the server booking endpoint or import a SeatLayer server SDK from
  browser or mobile-bundle code.

## Credentials

- Keep `SEATLAYER_SECRET_KEY` in server-side secret management.
- Do not place secret keys in public environment prefixes, browser bundles,
  source control, logs, screenshots, analytics properties, or error responses.
- Distinguish test and live credentials and fail clearly on environment/event
  mismatch.

## Buyer access capabilities

- Treat a `bse_` buyer access token and a hosted access URL as bearer
  capabilities, not identifiers.
- Mint buyer sessions only after host authentication and entitlement checks.
- Bind sessions to the exact HTTPS origin and event, keep browser tokens in
  memory, refresh through the trusted backend, and persist only the session id
  needed for audit or revocation.
- Never put a buyer token or hosted access URL in storage, query strings, logs,
  analytics, screenshots, exception text, or support transcripts.
- Never accept `channelIds`, `includePublic`, limits, or partner attribution from
  browser input. Derive scope from trusted server policy.
- Handle expired, revoked, wrong-origin, wrong-event, and exhausted allocation
  states explicitly. Never silently downgrade private access to public.

## Pricing and orders

- For chart-priced checkout, calculate from fresh server-side hold inspection
  line items.
- For host-priced checkout, recompute from the host's server-side price book
  and retain the inspected SeatLayer amount for reconciliation.
- Do not trust browser-supplied prices, item descriptions, totals, currencies,
  discounts, or tax decisions.
- Use the host order identifier as `bookingRef`.

## Idempotency and recovery

- Reuse the same `bookingRef` for retries of the same order.
- Treat a repeated success with an empty newly-booked list as a possible
  idempotent replay; follow the live booking contract.
- Treat HTTP `409` as an expected inventory conflict, not an opaque server
  failure.
- Do not charge again when retrying a SeatLayer booking.
- Define what happens when payment succeeds but booking cannot complete:
  automatic void/refund, durable retry, or operator recovery.

## Channels and publication

- Treat private as token-gated with no public link, not as disabled inventory.
- Choose one enforced channel access intent and manage its link/session
  lifecycle deliberately.
- Use optimistic `assignmentVersion` checks; do not automatically overwrite a
  concurrent allocation change.
- Use `ignoreChannelRestrictions: true` only for a genuine back-office override
  and include a short audit `reason`.
- Listing a managed event on an Organizer Website makes it discoverable through
  that public Website. Require an explicit organizer decision.

## Webhooks

- Verify signatures using the exact raw request body.
- Deduplicate by the documented occurrence identity.
- Acknowledge delivery quickly and move slow work to a durable queue when the
  host architecture supports it.
- Reconcile webhook facts with local order state; do not treat delivery order
  as business order.

## Agent behavior

- Never request or print credential values.
- Do not create production inventory or publish charts as a validation step.
- Use test mode for end-to-end probes.
- Require explicit user authorization for chart publication, cancellations,
  refunds, or other consequential live mutations.
