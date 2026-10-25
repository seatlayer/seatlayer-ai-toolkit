---
name: trace-floor-plan
description: Build a SeatLayer seating chart from a floor plan, seat map or venue drawing (PNG, JPEG or WebP) with the SeatLayer MCP's reference tools - upload, classify, read the regions, confirm labels and counts with the person, compile the outline, place the seats and check against the plan. Use when someone shares a venue plan image and wants a chart from it ("trace this seating plan", "turn this PDF screenshot into a chart", "build the hall from this drawing"). Treats the image as evidence, never as confirmed inventory.
---

# Trace a floor plan

Build a chart from a plan image, section by section, with the person
confirming every count, label and price the image cannot prove.

## Ground rules

- **The image is evidence, not inventory.** Seat counts, labels, accessible
  places and prices are confirmed by the person (or an authoritative source
  they name) before they become seats. Mark evidence `user-confirmed` only
  when they actually confirmed it; otherwise `model-observed`.
- Ask instead of guessing. Unclear regions, counts and labels go to the
  person as questions (`list_unresolved_reference_questions`).
- SeatLayer places geometry. Never supply coordinates; use region ids and
  the semantic tools.
- This skill builds a draft chart. It does not touch events on sale and does
  not publish: for that, the publish-and-apply skill, with the person's yes.
- The plan image stays private: it never appears in buyer output.
- Use a browser only to compare the result with the plan by eye with the
  person.

## Connection

Use `https://mcp.seatlayer.io/mcp?tools=build,trace` (the plain URL works
too). Tracing needs the reference-chart feature on the account. A workspace
connection first picks or makes the chart: `list_charts` and `select_chart`,
or `create_chart`.

## Steps

1. **Start.** `get_capabilities`. `begin_vision_probe`, then
   `confirm_vision_probe` with exactly what you read in its pictures (never
   guess; if you cannot read them, say images are not readable on this
   connection and stop). `get_chart` for `meta.updatedAt`.
2. **Upload and classify.** `upload_reference_image` with the image as base64
   `data` and its `filename`; keep the `assetId`. `set_active_reference`.
   `get_reference_overview`, and `get_reference_tile` for dense parts.
   `classify_reference_source` (`sourceClass`, `confidence`, `evidence`,
   `sourceDescription`; `expectedRevision` from `get_reference_set`). With
   several images, `configure_reference_set`: one geometry source, the rest
   supplemental.
3. **Read the regions.** `get_reference_regions`. If it answers
   `reference_analysis_pending`, wait `retryAfterSeconds` and call it again;
   it is not a failure. `reference_analysis_failed`: tell the person the plan
   could not be read and suggest a clearer image; do not loop.
4. **Say what each region is.** `submit_region_semantics` with an
   `observations` entry per region (`regionId`, `role`, `visibleLabel`,
   `confidence`, `evidence`). Then `list_unresolved_reference_questions` and
   ask the person every open question, in one short list.
5. **Outline.** `propose_reference_blueprint` (sections by region ids, the
   stage or focal point). Describe it to the person; after they agree,
   `approve_reference_blueprint`, then `compile_reference_skeleton`: section
   outlines only, no seats yet.
6. **Seats.** Ask the person for the total seats and standing places, the
   categories and prices, and the accessible places. Then either:
   - `plan_reference_capacity` with `targetCapacity` (changes nothing),
     `render_reference_capacity_preview`, show it, and after their yes
     `apply_reference_capacity_plan` with `assumptionsConfirmed: true` and
     `aggregateEvidence: "user-confirmed"`; or
   - `apply_reference_inventory` when they gave exact rows and seats per
     section.

   For one section at a time: `get_section_work_queue`, `get_section_context`,
   `fill_section_with_rows`, and `record_section_review` for progress.
7. **Check against the plan.** `validate_current_chart`; `render_preview`
   with `view: "reference-overlay"` and with `view: "chart"` on desktop and
   mobile; `diff_vs_reference`. `restore_reference_sections` snaps chosen
   section outlines back to the traced shape, keeping their seats, names and
   prices. Show the person the overlay.
8. **Hand over.** List what is built (sections, seats, standing, categories),
   what the person confirmed, and what is left: anything only the Designer
   can do (drawing or reshaping an outline, exact positions). Offer the
   publish-and-apply skill when they are happy.
