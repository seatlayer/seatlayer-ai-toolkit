# Feedback to tool

Every write takes `expectedUpdatedAt` (the newest `meta.updatedAt`) and, on a
multi-floor chart, `floorId`. Ids come from `get_chart`; seat ids from
`get_row_seats`, chair ids from `get_table_chairs`.

| The client says | Tool | Inputs that matter |
|---|---|---|
| "Call the balcony 'Upper Circle'" | `relabel_sections` | `names: [{sectionId, name}]` |
| "Number the sections 1 to 6 left to right" | `relabel_sections` | `sectionIds`, `scheme`, `direction`, `startAt` |
| "Rows should start at A at the front" / "skip I and O" | `relabel_rows` | `rowIds`, `scheme: "letters"`, `startAt`, `reverse`, `skipAmbiguous` |
| "Seat numbers run the wrong way" | `update_rows` | `rowIds`, `numbering` (`direction`, `startAt`, `step`, `scheme`) |
| "Rows A-C should be VIP" | `update_rows` | `rowIds`, `categoryKey` |
| "These seats are VIP" | `update_seats` (after `get_row_seats`) | `seatIds`, `categoryKey` |
| "The whole section is Premium" | `update_sections` | `sectionIds`, `categoryKey` |
| "VIP is 150, not 120" / "make Gold darker" / "rename Silver" | `update_chart_categories` | `updates: [{categoryKey, price, color, label}]` |
| "Add a Student price" | `create_chart_category` | `label`, `color`, `price`, `tiers` |
| "Mark wheelchair spaces in row K" | `update_seats` | `seatIds`, `accessibility`, `wheelchairSpaceType` |
| "Row Z has a restricted view" | `update_rows` or `update_seats` | `commercial` (`restrictedView`, `obstructedView`, `note`) |
| "Seat 14 isn't for sale" | `update_seats` | `seatIds`, `skipped: true` (takes the seats out of sale on the chart) |
| "Remove the old bar" | `delete_chart_objects` | `objectIds` first (a preview), then `confirmRemove: true` once the person agrees; it cannot be undone |
| "Add a bar by the entrance" / "toilets at the back" | `add_landmark` | `role` or `icon`, `label`, `nearObjectId`, `side`, `placement` |
| "Put a sign saying 'Lawn'" | `add_text` | `text`, `nearObjectId`, `side`, `size` |
| "Fix the text on the sign" | `update_texts` | `textIds`, `content`, `fontSize`, `color` |
| "Add a thrust stage" | `add_stage` | `kind`, `label`, `widthM`, `depthM` |
| "That's a runway, not a stage" | `update_stage_kinds` | `updates: [{stageId, stageKind}]` |
| "The stage caption should read vertically" | `update_shapes` | `shapeIds`, `labelStyle: {direction}` |
| "Show rows, not single seats, when zoomed out" | `update_chart_theme` | `sectionDetail: "rows"` |
| "Use our colours / font / logo" | `update_chart_theme` | `accent`, `background`, `fontFamily`, `logoUrl`, `brandName` |
| "Tables should seat 10" / "sell whole tables" | `update_tables` | `tableIds`, `seatCount`, `shape`, `bookingMode` |
| "Standing area holds 300" | `update_ga_areas` | `gaAreaIds`, `capacity` |
| "Rows are too close together" | `set_row_spacing` | `rowIds`, `gap` |
| "Split row F at seat 12" / "join rows G and H" | `split_row` / `merge_rows` | `rowId`, `index` / `rowIds` |
| "Add a gate on the north side" | `place_gate`, `update_gate` | `near`, `name`, `use`, `stepFree` |
| "Add a mezzanine floor" | `manage_chart_floors` | `action: "add"`, `name` |

## Not over the MCP (Designer only)

- Drawing or reshaping a section outline, or bending one by hand.
- Placing anything at an exact position or nudging it.
- A stage caption's font, size or colour.
- Anything `search_tools` returns as not possible, with where to do it.
