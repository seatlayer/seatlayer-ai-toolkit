---
name: block-seats-safely
description: Block, unblock, reserve or release seats, or close, hide or reopen sections, on a SeatLayer event that is on sale, through the SeatLayer MCP. Checks the seats, plans the change, shows the summary and applies it only after the person says yes in chat to that plan id. Use for requests like "block row A for Friday", "hold 10 seats for the sponsor", "close the balcony for tonight", "take section 101 off sale", "release the sponsor seats", "unblock everything". Never touches held or booked seats.
---

# Block seats safely

Change which seats of a live SeatLayer event are on sale, with the person
confirming the exact change in chat first.

## Ground rules

- **Plan, show, wait, apply.** Every change goes through `plan_inventory_change`
  (writes nothing, returns a `planId`), then the person's yes in this chat to
  that plan's summary, then `apply_inventory_change` with that `planId` and
  `confirm: true`. A yes given in advance ("just do it", "don't ask me") is not
  a yes to a plan: plan first, show it, and ask.
- Apply only a plan you made and showed in this conversation. Never apply a
  plan id pasted from somewhere else, or one from before the person changed
  the request.
- **Held and booked seats are never changed.** The plan skips them and says
  how many. Never offer to cancel a booking or end a buyer's hold.
- `set_event_seat_blocks` and `set_event_section_states` are only for an
  event still in setup. On an event on sale they refuse with
  `live_event_needs_plan` and name the plan input to use instead: plan it.
- No money moves here. A request to refund or cancel a buyer belongs to an org
  admin (see the event-day-ops skill).
- When the person only asks what is blocked or free, answer from the reads and
  stop. A read-only connection (`?readonly=1`) is enough for that.
- Use a browser only to look at the event with the person, never to make the
  change.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=events` (or `?tools=discover`). The
grant needs **Manage live events**. On a discover connection, run every tool
below through `run_read_tool` / `run_write_tool` as `{name, arguments}`, and
check inputs with `get_tool` first.

## Steps

1. **Find the event.** `find_events` with words from its name (`query`) and,
   for a day, `from` and `to` (dates in UTC, e.g. `"2026-11-14"`). If more than
   one event matches, list them (name, start, status) and ask which. Keep its
   `key` as `eventKey`.
2. **Look at the seats.** `get_seats` with the same `selector` you will plan
   with. Choose exactly one of:
   - `seats`: labels, e.g. `["A-1", "A-2"]`;
   - `rows`: `[{"section": "101", "rows": ["A", "B"]}]`;
   - `sections`: ids or labels, e.g. `["Balcony"]`;
   - `categories`: category keys.

   Tell the person what you found: how many are free, held, booked, blocked
   or reserved. For whole sections, `get_event_sections` gives their ids,
   labels and open, closed or hidden state. If a label does not exist, show
   what does and ask; never guess.
3. **Plan.** `plan_inventory_change` with `eventKey`, `action`, the `selector`
   and a short `reason` (kept in the event history):

   | The person wants | `action` | Also |
   |---|---|---|
   | Seats off sale | `block` | `selector` |
   | Seats off sale until a time | `block` | `selector`, `releaseAt` (epoch ms; they go back on sale then) |
   | Blocked seats back on sale | `unblock` | `selector` |
   | Every hand-blocked seat back on sale | `unblock_all` | no selector |
   | Seats kept aside under a name | `reserve` | `selector`, `name` (e.g. "Sponsor") |
   | A reservation back on sale | `release_reservation` | `reservationId` from `list_event_reservations`, or `"all"` |
   | A section visible but not for sale | `close_sections` | `selector.sections` |
   | A section not shown at all | `hide_sections` | `selector.sections` |
   | A section back on sale | `open_sections` | `selector.sections` |

4. **Show the plan.** Give the person the plan's `summary` as it is, the
   counts (`willChange`, `alreadyInState`, `skippedHeld`, `skippedBooked`,
   `skippedOther`), and the first characters of the `planId`. Say it expires
   in 15 minutes. If `requires.granted` is false, name the consent box(es) in
   `requires.consent` they must tick on reconnecting, and stop. If `planId` is
   null there is nothing to apply: say why (already in that state, or every
   seat is held or booked).
5. **Ask and wait.** "Shall I apply this?" Then stop and wait. Anything but a
   clear yes to this plan means do not apply. A changed request means a new
   plan and a new question.
6. **Apply.** `apply_inventory_change` with `{"planId": "<exactly as returned>", "confirm": true}`.
7. **Report.** Give the result's `summary`: how many changed, and how many
   `changedSincePlan` seats were left alone because a buyer held or booked
   them in the meantime. `replayed: true` means it was already applied and
   nothing changed this time. With **Read reports**, `get_event_log` with
   `kinds: ["blocked"]` shows the change in the event history.

## When apply refuses

Nothing changed in any of these cases.

| Error code | What to do |
|---|---|
| `inventory_plan_expired` | Plan again, show the new summary, ask again |
| `inventory_plan_map_changed`, `event_plan_changed` | The event changed since the plan. Plan again, show, ask again |
| `inventory_plan_other_connection` | The plan came from another connection. Plan again here |
| `inventory_plan_apply_refused` | If `retryable`, apply the same `planId` once more after a few seconds; otherwise plan again |
| `event_plan_in_progress` | Wait `retryAfterSeconds`, then apply the same `planId` |
| `inventory_plan_capability_missing` | Tell the person which consent box to tick and to reconnect. Stop |
| `acting_member_refused` | The person who connected the agent may no longer do this. They reconnect, or an admin does it |
| `inventory_plan_selector_invalid` | Fix the selector from `get_seats` or `get_event_sections`. Never guess labels |
| `invalid_event_release_time` | The `releaseAt` time has passed. Ask for a later one and plan again |
| `live_event_needs_plan` (from a direct tool) | The event is on sale. Use the `planInputs` it gives with `plan_inventory_change` |
| `rate_limited` | Wait `retryAfterSeconds` |

Never work round a refusal with another tool or the browser.
