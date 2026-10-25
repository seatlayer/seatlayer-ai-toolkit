---
name: event-day-ops
description: Run a SeatLayer event on the day through the SeatLayer MCP - door and attendance counts, closing or reopening a section, blocking seats, stopping or reopening sales, looking up an order, resending tickets, and asking an admin to approve a refund or cancellation. Every live change is planned, shown and applied only after the person's yes in chat; money is never moved by the agent. Use for "how many are in?", "close the balcony now", "stop sales for tonight", "the buyer never got their tickets", "refund order 1234 5678", "who has seat F-4?".
---

# Event-day operations

Answer the door and box office during a live event, and make the small live
changes the day needs, safely.

## Ground rules

- **Live changes go plan, show, yes, apply.** `plan_inventory_change`, show its
  `summary` and plan id, wait for the person's yes in chat to that plan, then
  `apply_inventory_change` with that `planId` and `confirm: true`. A yes given
  in advance is not a yes to a plan. `set_event_seat_blocks` and
  `set_event_section_states` refuse an event on sale (`live_event_needs_plan`)
  and name the plan to make instead; make that plan.
- **Held and booked seats are never changed.**
- **Money never moves from here.** A refund or cancellation is only ever a
  request: `request_order_refund` returns an approval link that an org admin
  opens in the dashboard. Give the person the link, say nothing is refunded
  until an admin approves, and never say it was refunded.
- Buyer details from the orders tools are for this job only: confirm what is
  needed (for example "tickets go to p•••@example.com"), and do not paste
  whole orders, emails or phone numbers into chat.
- For counts and lookups only, a read-only connection (`?readonly=1`) is
  enough and safer.
- Use a browser only to look at the dashboard with the person. Never work
  round a refusal with it.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=events`. Ticked boxes needed:
**Manage live events** (seats, sections), **Read reports** (door counts),
**Create and run events** (stopping or reopening sales) and **Look after
orders** (orders and resends).

**Orders tools** (`find_order`, `get_order`, `get_order_timeline`,
`list_orders`, `resend_tickets`, `request_order_refund`) are new. If
`get_capabilities` does not list them on this connection, the server or the
grant does not have them yet: say so, and send the person to the dashboard
Orders page for that part. Everything else below works without them.

## Jobs

### Find tonight's event

`find_events` with `from` and `to` set to today (UTC) and `status: ["live"]`.
If several match, ask which. Keep its `key`.

### How many are in?

`get_event_report` with `parts: ["attendance"]`: `checkedIn` against
`expected`, `stillToCome`, and the same per section and ticket type. Add
`"activity"` with `unit: "hour"` for arrivals and sales by the hour. If
`attendance.available` is false the event issues no SeatLayer tickets and has
no door count. Checking people in happens in the door app, not here.

### Close or reopen a section, block or reserve seats

1. `get_event_sections` (ids, labels, states) or `get_seats` with the
   `selector` you will use.
2. `plan_inventory_change` with `action` `close_sections` (visible, not for
   sale), `hide_sections`, `open_sections`, `block`, `unblock` or `reserve`
   (with `name`), the `selector` and a `reason`.
3. Show the summary (what changes, what is skipped because held or booked)
   and ask. After the yes, `apply_inventory_change`. The block-seats-safely
   skill has the full refusal table.

### Stop or reopen sales

`plan_inventory_change` with `action: "close_sales"` (or `reopen_sales`). Show
the summary and ask; after the yes, `apply_inventory_change`. Needs **Create
and run events** and an admin or designer role.

### "I never got my tickets"

1. `find_order` with what the person has: order reference, email, name, phone
   or seat.
2. `get_order` to check the order is confirmed and which tickets it holds.
3. Confirm with the person that the address on the order is right. A new
   address is set in the dashboard, not here.
4. `resend_tickets` with `eventKey` and `orderRef`. Tell the person where it
   went (`sentTo`). At most three resends an hour per order.

### "Refund this order" or "cancel seat C5"

1. `find_order`, then `get_order` for the seats and what was paid.
2. `request_order_refund` with `action: "refund"` (money back through the
   payment provider; `amountMinor` for part of it) or `action: "cancel"`
   (tickets voided, money handled elsewhere, with a `reason`), optional
   `seats` and the person's `note`.
3. Give the person the approval link from the result: an org admin must open
   it and approve within 24 hours. Nothing is refunded or cancelled until
   then; `get_order_timeline` shows when it happens.

## When a plan's apply is refused

`inventory_plan_expired`, `event_plan_changed`, `inventory_plan_map_changed`:
nothing changed; plan again, show, ask again. `inventory_plan_capability_missing`:
name the consent box to tick and stop. `rate_limited`: wait
`retryAfterSeconds`.
