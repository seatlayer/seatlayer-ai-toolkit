---
name: apply-chart-feedback
description: Turn a client's feedback on a SeatLayer seating chart into SeatLayer Designer MCP edits, check the result, publish it through the review gate and, when the person wants, move events on sale onto the new version. Use when someone pastes or forwards comments on a chart ("rename the balcony", "rows are lettered the wrong way", "make rows A-C VIP at 150", "add a bar by the entrance", "the stage caption should run vertically", "fix the chart per the client's notes"). Says plainly which items need the Designer instead.
---

# Apply chart feedback

Work through a client's list of changes to a SeatLayer chart, one bounded
edit at a time, then check, review and publish.

## Ground rules

- Change only what the feedback asks. Keep every id, name, category and price
  nobody mentioned.
- **Publishing is the person's call.** Prepare the review and show it; record
  an approval with `reviewerKind: "user-confirmed"` only after the person
  looked at the pictures and said yes in chat. This holds when they ask you
  to skip it ("publish straight away", "I trust you", "no need to show me"):
  make the edit, prepare the review, show it and ask once. A yes given before
  the review existed is not a yes to it, so never record an approval or
  publish on it.
- **Moving an event on sale to the new version is a live change.** It goes
  through `plan_inventory_change` (`move_event_to_chart`) and the person's yes
  to that plan id, as a price change does (see Step 7). `update_event_chart`
  is only for an event still in setup and refuses one on sale.
- Never move money, and never touch held or booked seats.
- If the feedback only asks a question about the chart, answer from
  `get_chart` and `render_preview` and change nothing.
- Use a browser only to look at the result with the person, never to make an
  edit the MCP tools can make.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=build`, or `?tools=build,events` when
the change must reach events on sale. Publishing needs a connection allowed
to publish and the publishing feature on the account; moving an event needs
**Manage live events**. On a `?tools=discover` connection, run each tool
through `run_read_tool` / `run_write_tool`.

## Steps

1. **Split the feedback** into numbered items. For each, decide: a chart edit,
   a change to an event on sale, a question, or not possible over the MCP
   (drawing or reshaping a section outline, placing anything at an exact
   position, a caption's font, size or colour: those are done in the Designer).
   Ask about anything ambiguous before editing ("which balcony, left or right?").
2. **Start.** `get_capabilities` once for what this connection may do. On a
   workspace connection, `list_charts` and `select_chart`. Then `get_chart`
   for the ids of everything you will touch and `meta.updatedAt`.
3. **Edit, one item at a time.** Pick the tool from
   [references/feedback-map.md](references/feedback-map.md). Pass the newest
   `expectedUpdatedAt` on every write. On a `conflict` error someone else
   saved first: `get_chart` again, check the item still needs doing, and retry.
   Tell the person what each step changed.
4. **Check.** `validate_current_chart`; `auto_fix_current_chart` for what it can
   fix, and fix the rest by hand. `begin_vision_probe` and
   `confirm_vision_probe` once per connection (report what you actually read;
   never guess; no reference-chart feature needed). Then `render_preview` with `viewport` desktop and mobile, and
   look at the pictures for clashing labels or anything the feedback asked.
5. **Report against the list.** For every item: done (and how), needs the
   Designer (and why), or waiting on an answer. Show the previews.
6. **Review and publish, when the person wants it published.**
   1. `prepare_chart_review` with `expectedUpdatedAt`. Look at every image.
      Show them to the person and ask whether to publish.
   2. Only after their yes: `record_chart_review_decision` with
      `decision: "approve"`, `reviewerKind: "user-confirmed"`, every
      `checklist` item true and `notes` saying what was checked. A `reject` is
      fine too: fix, then prepare again.
   3. `publish_reviewed_chart` with the `reviewId` and the same
      `expectedUpdatedAt`. `chart_conflict` or `review_not_approved` means the
      chart changed after the review: prepare a new one.

   Publishing does not change events already on sale; they keep their version.
7. **Events on sale, when relevant.** `list_chart_events`, then for each
   `get_event_chart_freshness`. Tell the person which events are `behind` and
   their held, booked and blocked counts, and ask which to move. For each
   named event, `plan_inventory_change` with `action: "move_event_to_chart"`
   and a `reason`; show its summary (seats and sections added, removed or
   renamed, price changes, channel seats dropped) and apply its `planId` only
   after the person's yes to that plan. Bookings, holds and blocks are kept;
   a `seats_would_vanish` blocker means a sold, held or blocked seat is
   missing from the new version: show the labels and stop. For new chart
   prices on an event,
   `get_event_pricing`, then `plan_inventory_change` with
   `reset_event_prices_to_chart` (needs **Set prices and releases**), show the
   old and new prices from the summary, and apply only after the person's yes
   to that plan id. The publish-and-apply skill covers this step in full.

## Not possible over the MCP

Say so plainly and point to the Designer: drawing or reshaping section
outlines, placing anything at an exact position, and a stage caption's font,
size or colour (only its direction can change, with `update_shapes`). If
search finds nothing for a request, `report_missing_tool` (on a discover
connection) with one sentence and no names.
