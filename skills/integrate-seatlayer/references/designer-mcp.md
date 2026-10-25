# SeatLayer MCP

Use the SeatLayer MCP for chart authoring and review, Event Configurations, and
running events an organiser has allowed: sales, prices, channels, orders and
reports. Ordinary SDK and booking integration does not need it.

The remote resource is `https://mcp.seatlayer.io/mcp`. It uses Streamable HTTP,
OAuth 2.1 authorization code flow with PKCE S256, the `resource` parameter, and
rotating refresh tokens. The dashboard's **AI agents** page shows the URL for
each environment.

The public knowledge MCP at `https://docs.seatlayer.io/mcp` is a different
server: anonymous, read-only product knowledge and documentation search. Use it
for integration questions, not chart edits.

## What it covers

| Covered | Not covered |
|---|---|
| Building and editing charts: sections, rows, seats, tables, booths, GA areas, floors, zones, text, shapes, categories, theme | Holds, bookings and checkout |
| Tracing a chart from a reference image, with confirmed counts and labels | Taking or returning money: a refund or cancellation is a request an admin approves |
| Validation, buyer previews, 3D structure, sightline scores | Webhooks, API keys, members, billing |
| Review and publication of an approved revision | Buyers' personal details in reports |
| Events: create, edit, copy, open and close online sales, end an event | |
| Prices and ticket releases, sales channels and their links | |
| Live seats: block, unblock, hold back for guests, close sections | |
| Orders: find them, resend tickets, request a refund | |
| Reports and History | |

An agent on this server can prepare the map and run the event, but it cannot
sell a seat or move money. Selling stays with the Server API and the host's
checkout.

## Scope and permissions

- An admin approves each connection on a consent screen. One tap on **Allow**
  gives the agent the workspace and every permission; **Customize** narrows it
  to one chart or turns permissions off.
- A change to an event on sale is a plan first: the agent shows it and applies
  it only after the person's yes to that plan in the chat. Blocking refuses the
  whole change if a seat is held or booked.
- Admins get an email about each agent change, the event's History names the
  agent, and an agent publish can be undone in one click.
- Publishing and approval tools need publish permission. Reference, blueprint
  and capacity tools need the reference-chart feature; Event Configurations need
  that module on the account.
- Access tokens expire after an hour. Each connection can make up to 300 tool
  calls per minute.
- The server lists only the tools a connection may use (160 with every
  permission). Call `get_capabilities` for the actual list; never assume a tool
  exists.

## Toolsets

Every tool's description is sent to the model on every turn. A chat host can
connect with a smaller set by adding `?tools=` to the server URL:

| URL | Tools for |
|---|---|
| `https://mcp.seatlayer.io/mcp?tools=build` | Build, edit, price, check and publish charts (63 tools) |
| `?tools=build,trace` | Adds tracing a floor-plan image |
| `?tools=build,3d` | Adds heights, sightlines and seat-view evidence |
| `?tools=events` | Events on sale: seats, plans, reports, prices, sales, channels, orders (46 tools) |
| `?tools=discover` | About ten tools; `search_tools` finds the rest |
| `?readonly=1` | Only tools that read; any write is refused. Combines with a set |
| `https://mcp.seatlayer.io/mcp` | Every tool |

A toolset only narrows what is listed. The connection's permissions still
decide what any call may do.

## Build a new venue from a description

Use the `seatlayer-venue-spec` skill in this toolkit. The agent writes the whole
venue as one short JSON Venue Spec (categories, prices, stage, rows, tables,
standing, booths, landmarks, all in words, never coordinates), checks it with
`build_from_venue_spec` and `checkOnly: true`, then builds it in one call.
Every problem comes back with the field that needs fixing. The same file can be
pasted into the Designer (**New from → Paste from an AI…**) when no connection
is available. Format: `https://docs.seatlayer.io/agents/venue-spec/index.md`.

## Workflow for tracing and review

1. Call `get_capabilities`; do not assume deployed tools or schemas.
2. Authorize the intended chart or workspace scope.
3. Treat uploaded plans as private evidence, not authoritative inventory.
4. Inspect required overview and detail tiles.
5. Record semantic meaning, confirmed labels/counts, confidence, and open
   questions.
6. Prefer semantic intents and deterministic SeatLayer compilers over invented
   coordinates. Use the newest `expectedUpdatedAt` on mutations.
7. Validate and render every floor after bounded changes.
8. Prepare the exact immutable revision for review.
9. Publish only after the user explicitly approves that unchanged revision.

For a person working in the Designer instead of an agent, **Click the plan**
turns a floor plan image or PDF into blocks of seats, rows, or traced sections:
`https://docs.seatlayer.io/designer/reference-plan-import/index.md`.

## Guardrails

- Do not enumerate unrelated charts, users, buyers, billing, or API keys.
- Do not use unconfirmed image counts, labels, accessibility, categories, or
  pricing as sellable facts.
- Do not expose private reference images in buyer output.
- Treat machine validation as necessary but insufficient for visual approval.
- Any mutation after review invalidates the prior approval.
- Never give the model a SeatLayer secret API key.

Live source:
`https://docs.seatlayer.io/agents/designer-mcp/index.md`.
