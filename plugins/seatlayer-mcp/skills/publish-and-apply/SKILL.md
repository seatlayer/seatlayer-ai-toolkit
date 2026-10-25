---
name: publish-and-apply
description: Publish a finished SeatLayer chart through the review gate (validate, preview, prepare the review, the person approves, publish) and then bring events already on sale onto the new version, keeping every booking and hold, with the person saying yes to each live change in chat. Use for "publish the chart", "the client approved it, put it live", "update Friday's map to the new layout", "push the new prices to the events on sale".
---

# Publish and apply

Publish an approved chart revision, then move the events on sale that should
use it.

## Ground rules

- **The person approves.** Record a review approval only after the person has
  seen the review pictures and said yes in chat. Never approve on their
  behalf, and never treat machine checks passing as approval. "Publish
  without showing me" still gets the review shown and one question: a yes
  given before the review existed is not a yes to it.
- **Every change to an event on sale is a plan the person says yes to.**
  Moving an event onto the new version, a price change, a venue
  configuration: `plan_inventory_change`, show the summary, and apply its
  `planId` only after the person's yes to that plan. A yes given in advance
  ("publish and update everything, don't ask") is not a yes to a summary they
  have not seen. `update_event_chart` and `set_event_configuration_binding`
  are only for an event still in setup; on an event on sale they refuse with
  `live_event_needs_plan` and name the plan to make.
- Bookings and holds are always kept. If a held or booked seat would vanish,
  stop and show the labels; never force it.
- Never move money.
- Use a browser only to look at the published map with the person.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=build,events`. Publishing needs a
connection allowed to publish (and the publishing feature on the account);
moving events needs **Manage live events**; event prices need **Set prices
and releases**. On a `?tools=discover` connection, run each tool through
`run_read_tool` / `run_write_tool`.

## Steps

### Publish

1. `get_chart` for `meta.updatedAt`. `validate_current_chart` must show no
   errors (`auto_fix_current_chart` fixes some; fix the rest or send the
   person to the apply-chart-feedback skill).
2. `begin_vision_probe`, then `confirm_vision_probe` with what you read, once
   per connection (it needs no reference-chart feature). `vision_probe_required`
   from a later tool means this step was skipped.
3. `render_preview` with `viewport` desktop and mobile. Look at both.
4. `prepare_chart_review` with `expectedUpdatedAt`. Look at every image it
   returns, show them to the person, and ask: publish this?
5. After their yes: `record_chart_review_decision` with `decision: "approve"`,
   `reviewerKind: "user-confirmed"`, all four `checklist` items true and
   `notes` on what was checked. If they say no, `decision: "reject"` with
   their reason, and stop.
6. `publish_reviewed_chart` with the `reviewId` and `expectedUpdatedAt`.
   `chart_conflict` or `review_not_approved`: the chart changed after the
   review, so prepare a new review and ask again. `review_blocked`: fix what
   it lists first.

Publishing does not change any event on sale.

### Apply to events on sale

7. `list_chart_events` for the chart's events. For each one the person cares
   about, `get_event_chart_freshness`: `behind` says it uses an older version,
   and `counts` gives held, booked and blocked seats.
8. Ask which of the events that are behind to move, by name.
9. For each named event, one at a time: `plan_inventory_change` with
   `eventKey`, `action: "move_event_to_chart"` and a `reason`. It writes
   nothing. Show the person its `summary`: the seats and sections the new
   version adds, removes or renames, the prices that change, and any seats
   that leave a sales channel. Bookings, holds and blocks stay.
   - A `blockers` entry means the move cannot be applied and the plan has no
     `planId`: `seats_would_vanish` (a sold, held or blocked seat is not in
     the new version: show the labels and stop; the chart needs fixing),
     `event_configuration_bound` (see step 11), a performance group or season
     lock (the dashboard). Do not look for a way round it.
   - Channel seats in the summary leave their channel when the move applies.
     The person's yes to this plan is what agrees to that, so say it plainly.
10. Only after the person's yes to that plan: `apply_inventory_change` with
    its `planId` and `confirm: true`. Report what changed. `chart_plan_stale`
    means the chart was published again, or the event's map, channels or
    sales changed since the plan: nothing changed; plan again and ask again.
    For an event still in setup (nothing held or sold) `update_event_chart`
    does the same move without a plan.
11. **Prices, if the chart's prices changed.** `get_event_pricing` shows each
    event's own price and the chart's. To put an event on the chart's prices,
    `plan_inventory_change` with `action: "reset_event_prices_to_chart"`; show
    the old and new prices from the summary; after the person's yes to that
    plan, `apply_inventory_change` with its `planId` and `confirm: true`.
    Holds and bookings keep the price already promised. On a free event the
    summary says there is no price change for buyers; say so.
12. **Events that use an Event Configuration** (`get_event_configuration_binding`
    shows one) follow that configuration's published version, not the chart
    directly, and cannot move until it is removed. To change or remove a
    binding: `plan_inventory_change` with `action: "set_configuration_binding"`
    and `configuration` (`{"id", "version"}` from `list_event_configurations`,
    or `null`). The summary says which seats it takes off sale and gives back;
    a held or sold seat it would take off sale is a blocker. Apply only after
    the person's yes to that plan.

### When a plan's apply is refused

`inventory_plan_expired`, `event_plan_changed`, `pricing_plan_stale`,
`chart_plan_stale`: nothing changed. Plan again, show the new summary, ask
again. `feature_disabled`: publishing is off for this connection; stop.
`inventory_plan_capability_missing`: name the consent box to tick, and stop.
