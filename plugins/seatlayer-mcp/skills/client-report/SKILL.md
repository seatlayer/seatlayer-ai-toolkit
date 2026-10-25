---
name: client-report
description: Write a client-facing summary of how a SeatLayer event is doing (tickets sold by category, money taken, sales pace, door attendance and what changed) from the SeatLayer MCP's get_event_report, get_seats and get_event_log, on a read-only connection. Use for "how is Friday selling?", "send the promoter an update on Diwali Night", "takings so far", "what changed on the show this week?". On a free event it quotes no prices or money. Changes nothing. Live door counts during the event belong to event-day-ops.
---

# Client report

Turn one event's figures into a short, plain summary a client can read.

## Ground rules

- **Read only.** Use a read-only connection and change nothing. If the person
  asks for a change while you report, finish the report, then say which skill
  and connection does it (for example block-seats-safely on `?tools=events`).
- Every number comes from a tool result. No estimates, no forecasts presented
  as facts, no rounding that changes the meaning.
- **Free event: no prices and no money.** When `get_event_report` returns
  `freeEvent: true`, leave out prices, booked value, takings and refunds
  entirely, and say "Free event: buyers pay nothing."
- No buyer names, emails or phone numbers. The tools return none; never
  guess at who bought what.
- Never move money. Refunds and cancellations are an org admin's job in the
  dashboard.
- Use a browser only to show the person the dashboard, never to collect
  figures the tools give.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=events&readonly=1`. The grant needs
**Read reports** for `get_event_report` and `get_event_log`. A grant without
it can still answer seat questions with `find_events` and `get_seats`; say
the rest needs that box ticked.

## Steps

1. **Find the event.** `find_events` with `query` and, for a date, `from` and
   `to`. If several match, ask which. Keep its `key`.
2. **Get the report.** `get_event_report` with `eventKey`. Leave `parts` out
   for everything (`sales`, `money`, `activity`, `attendance`), or ask for
   fewer. On the day itself use `unit: "hour"` for activity.
3. **Specific seats, only if asked.** `get_seats` with a `selector` (rows,
   sections, categories or seat labels) and `states`, e.g. "is section 101
   sold out?".
4. **What changed, only if asked.** `get_event_log` with `eventKey`, `from`
   (a date) and `kinds`, e.g. `["blocked", "price", "map"]`. Describe the
   changes; name who made them only if the person asks.
5. **Write the summary.** Keep this order and drop sections with nothing in
   them:
   - **Headline**: event name, date, sales state, and sold of sellable seats
     (with the percentage).
   - **By category**: sold, held and still free per category. Prices only on
     a paid event.
   - **Money** (paid events only): taken so far by channel or payment method,
     refunds and discounts. Fields ending in `Minor` are in the currency's
     minor units (cents): convert them and name the currency.
   - **Sales pace**: from `activity`, e.g. bookings per day over the last week.
   - **At the door** (once doors open): checked in against expected, from
     `attendance`. If `available` is false, say there is no door count.
   - **Changes**: from the log, if asked.
   - **As of**: the time you read the figures, in the event's time zone.
6. Offer the person the text to paste; do not send it anywhere yourself.

## Limits

One event per report. For a file export or a comparison across shows,
seasons or years, point to the dashboard Reports page.
