# Safety contract

Apply these rules whenever code can affect credentials, prices, holds,
inventory, payments, bookings, cancellations, or webhooks.

## Browser/server authority

- The browser may render, select, hold, release, and hand off an opaque
  `holdId`.
- A trusted server authenticates the user, authorizes the event/order, inspects
  the hold, calculates the trusted charge, coordinates payment, and books.
- Never call the booking endpoint from browser or mobile-bundle code.

## Credentials

- Keep `SEATLAYER_SECRET_KEY` in server-side secret management.
- Do not place secret keys in public environment prefixes, browser bundles,
  source control, logs, screenshots, analytics properties, or error responses.
- Distinguish test and live credentials and fail clearly on environment/event
  mismatch.

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
