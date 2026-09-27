---
name: seatlayer-venue-spec
description: Write a SeatLayer Venue Spec, a short JSON file that describes a venue's seating in words, and build it into a SeatLayer seating chart. Use when the user wants a seating chart, seat map or venue map for SeatLayer, describes a venue (theatre, arena, wedding, club, expo, comedy club) to turn into one, or asks for a Venue Spec file. Uses the SeatLayer MCP connector when it is available; otherwise writes JSON the user pastes into the SeatLayer Designer.
---

# SeatLayer Venue Spec

A Venue Spec says what a venue has and where, in words: ticket categories and
prices, a stage, straight and curved rows, tables, standing areas, booths,
landmarks, signs and named areas. SeatLayer places everything. The file never
carries coordinates.

- JSON Schema: https://docs.seatlayer.io/schemas/venue-spec-v1.json
- Guide: https://docs.seatlayer.io/agents/venue-spec/
- Examples: `examples.md` next to this file

## Workflow

### If the SeatLayer MCP connector is available

The tools below are in every toolset, including the smaller
`https://mcp.seatlayer.io/mcp?tools=build` connection.

1. `get_chart` for `meta.updatedAt`. On a workspace connection with no chart
   selected, `create_chart` first.
2. `get_venue_spec_format` for the schema, rules and examples, before the
   first build in a conversation.
3. Write the spec. Call `build_from_venue_spec` with `spec` and
   `checkOnly: true`. Nothing is saved. Read the summary (seats, tables,
   booths, standing, sections, capacity) and compare it with what the user
   asked for.
4. If it returns `invalid_venue_spec`, fix every field in `issues` and check
   again. A few checks (one kind of place per category, base layout inputs)
   run once the fields are right, so a second, shorter list can follow.
5. Tell the user the build replaces the current draft. Then call
   `build_from_venue_spec` with `spec` and `expectedUpdatedAt`. On
   `conflict`, call `get_chart` and retry with the new `meta.updatedAt`.
6. `validate_current_chart`. Fix errors with the edit tools
   (`update_rows`, `update_chart_categories`, `add_landmark` and others).
7. `render_preview` on desktop and mobile (after `begin_vision_probe` and
   `confirm_vision_probe` once), and show the user.

Every `build_from_venue_spec` call, including `checkOnly`, counts toward 60
venue builds per hour per connection. Do not approve or publish without the
user's explicit decision.

### Without the connector

Reply with the Venue Spec in one JSON code block. After it, tell the user:
in the SeatLayer Designer, open **New from → Paste from an AI…** and paste the
whole reply (the free demo Designer at https://app.seatlayer.io/demo/designer
works without an account). The Designer checks it, shows a preview and builds
it. If it lists problems and the user pastes them back, fix every field named
and reply with the whole corrected JSON in one code block.

Ask a question first only when you cannot tell the counts: rows and seats per
row, tables and chairs, standing capacity, or booths.

## Rules

1. Start with `"seatlayerVenueSpec": 1`. Give `name` and `categories`, and
   usually `items`. Other top-level fields: `$schema`, `stage`, `base`. No
   other fields anywhere: unknown fields are errors.
2. Never give coordinates. Say where in words; SeatLayer places everything.
3. List items from the stage outward. Each item goes against everything
   placed before it: `placement` is `front` (toward the stage), `rear`
   (default), `left` or `right`. Two `rear` items stand one behind the other.
   To put a landmark, sign or area next to something named earlier ("the
   entrance next to the bar"), give `near` with that name and `side`.
4. One category sells one kind of thing: row seats (`rows`, `curvedRows`),
   table chairs (`tables`), `booths`, or `standing`. If one price covers two
   kinds, make two categories.
5. With more than one category, every `rows`, `curvedRows`, `tables`,
   `standing` and `booths` item needs `category` set to a category name.
6. Use `base` for an arena bowl or several floors, then add items. `base`
   brings its own stage: leave `stage` out and use `base.stageKind`.
7. Without `base`, a plain stage is added unless `stage` is `false`.
8. Prices are plain numbers in the event currency, with no currency symbol.

## Top level

| Field | Rules |
|---|---|
| `seatlayerVenueSpec` | Required. Always `1` |
| `name` | Required. 1 to 160 characters |
| `categories` | Required. 1 to 7, most expensive first, names all different. Each: `name` (required, up to 80), `price` (0 to 1,000,000), `color` (`#rrggbb`) |
| `items` | Up to 80 items |
| `stage` | Leave out for a plain stage; `false` for none; or `kind`, `label`, `widthM` and `depthM` (1 to 400) |
| `base` | A ready-made venue; see below |

Stage `kind`: `rect` (default), `rounded`, `arc`, `thrust`, `runway`, `round`,
`pitch-football`, `rink-hockey`, `track-athletics`, `oval-cricket`,
`pitch-rugby`, `diamond-baseball`, `court-basketball`, `court-tennis`,
`ring-boxing`.

## Items

`*` marks a required field. Names (`label`, `section`, `category`,
`near`) are up to 80 characters.

| type | Fields |
|---|---|
| `rows` | `rowCount`* 1-100, `seatsPerRow`* 1-300 (the whole row, across all blocks), `blocks` 1-8 (default 1; 2 = one centre aisle), `category`, `placement`, `section` |
| `curvedRows` | `rowCount`* 1-60, `spreadDegrees` 20-360 (180 semicircle; 360 all round; leave out to fit `seatsPerRow`, else 100), `seatsPerRow` 2-300 (leave out to fit), `aisles` none/center/two, `firstRowDistanceM` 1-200 (default 4), `category`, `section`. Always behind the seats already placed; no `placement` |
| `tables` | `tableRows`* 1-20, `tableColumns`* 1-20, `seatsPerTable` 1-20 (default 8), `shape` round/rect, `category`, `placement`, `section` |
| `standing` | `capacity`* 1-100000, `label` (default "General Admission"), `category`, `placement` |
| `booths` | `boothRows`* 1-30, `boothColumns`* 1-30, `category`, `placement`, `section` |
| `landmark` | exactly one of `role` or `icon`; `label`, `placement`, `near`, `side` |
| `text` | `text`* up to 120 characters, `size` small/medium/large, `showAt` always/when-it-fits/close-up, `placement`, `near`, `side` |
| `area` | `label`*, `widthM`* and `depthM`* 0.5-400 metres, `shape` rect/ellipse, `placement`, `near`, `side`. For spaces nobody books: dance floor, desk, lounge |

`seatsPerRow` counts the whole row: 24 with `blocks: 2` is two blocks of 12 (an odd seat goes to the first block).

Landmark `role`: bar, entrance, exit, restroom, screen, sound, concession,
coat, wall, rail, suite, obstruction.

Landmark `icon`: restroom-men, restroom-women, restroom-accessible, restrooms,
first-aid, coat-check, atm, info, lost-found, charging, smoking, no-smoking,
food, bar, coffee, water, merch, screen, sound-booth, entrance, exit,
emergency-exit, stairs, elevator, parking, wheelchair, hearing.

`landmark`, `text` and `area` also take `placement: "center"`, where `front`
means between the stage and the seats. `near` names something made earlier:
a section, landmark, area or standing area (for example `"Bar"`); `side`
(front, rear, left, right; default rear) says which side of it, and only works
with `near`.

When the venue has sections, tables and booths without a `section` get one
named after their category. Phones open the map on section blocks, so
anything outside a section would not show there.

## base

`layout`* is one of rows, bowl, tables, ushape, booths, nightclub, runway,
restaurant, hybrid. Each layout reads only some fields; any other field is an
error.

| layout | Reads |
|---|---|
| rows | rowCount, seatsPerRow, blocks, floors |
| bowl | rowCount, seatsPerRow, sectionCount, standingCapacity, floors |
| tables, ushape | tableRows, tableColumns |
| booths | boothRows, boothColumns |
| nightclub | standingCapacity |
| runway | rowCount, seatsPerRow |
| restaurant | nothing extra |
| hybrid | rowCount, seatsPerRow, blocks, standingCapacity |

Every layout also reads `stageKind` (rect, rounded, arc, thrust, runway,
round) and `sectionNames` (named clockwise from the stage end: North, East,
South, West for a four-stand bowl).

Limits: rowCount 1-40; seatsPerRow counts the whole row (for rows and hybrid it
must split evenly into the blocks, which default to 2, at most 100 per block;
for bowl and runway it is one stand's row, at most 100); blocks 1-8; sectionCount 2-16
(default 4), tableRows and tableColumns 1-20, boothRows and boothColumns 1-30,
standingCapacity 1-100000, floors 1-5.

nightclub, runway, restaurant, and bowl with standingCapacity need at least
two categories; the last one sells standing (bar stools for restaurant).

## Example

A 400-seat theatre: stalls in two blocks, curved rear stalls, two prices.

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "Riverside Theatre",
  "categories": [
    { "name": "Premium", "price": 80 },
    { "name": "Standard", "price": 55 }
  ],
  "stage": { "kind": "arc", "label": "Stage" },
  "items": [
    { "type": "rows", "rowCount": 10, "seatsPerRow": 24, "blocks": 2, "category": "Premium", "section": "Stalls" },
    { "type": "curvedRows", "rowCount": 5, "seatsPerRow": 32, "spreadDegrees": 90, "aisles": "two", "category": "Standard", "section": "Rear Stalls" },
    { "type": "landmark", "role": "exit", "label": "Exit", "placement": "left" },
    { "type": "landmark", "role": "exit", "label": "Exit", "placement": "right" },
    { "type": "landmark", "role": "entrance", "label": "Main entrance", "placement": "rear" }
  ]
}
```

More in `examples.md`: wedding, club, arena, expo and comedy club.

## Common mistakes

| Problem the checker reports | Fix |
|---|---|
| `items[0].rows`: is not a field here. Did you mean "rowCount"? | Use the field names above |
| `items[2].category`: "Gold" is not in categories | Add the category, or use an existing name |
| `items[1].category`: "Premium" already sells row seats | Give tables, standing or booths their own category |
| `base.blocks`: the bowl layout does not use it | Remove fields the layout does not read |
| `stage`: leave out when base is used | Use `base.stageKind` |

## Not possible in a Venue Spec

Exact positions, drawn section outlines, gates and step-free routes as their
own objects, and tracing a floor-plan image. Say so plainly. The user finishes
those in the SeatLayer Designer; image tracing has its own MCP workflow
(https://docs.seatlayer.io/agents/designer-mcp/).
