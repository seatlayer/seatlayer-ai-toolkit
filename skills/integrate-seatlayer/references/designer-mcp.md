# Designer MCP

Use Designer MCP only for chart authoring, chart review, Event Configurations,
or permitted live event controls. Ordinary SDK and booking integration does not
need it.

The remote resource is `https://mcp.seatlayer.io/mcp`. It uses Streamable HTTP,
OAuth 2.1 authorization code flow with PKCE S256, the `resource` parameter, and
rotating refresh tokens. The dashboard's **Agent connections** page shows the
URL and publish permission for each environment.

The public knowledge MCP at `https://docs.seatlayer.io/mcp` is a different
server: anonymous, read-only product knowledge and documentation search. Use it
for integration questions, not chart edits.

## What it covers

| Covered | Not covered |
|---|---|
| Building and editing charts: sections, rows, seats, tables, booths, GA areas, floors, zones, text, shapes, categories, theme | Holds, bookings, cancellations, refunds |
| Tracing a chart from a reference image, with confirmed counts and labels | Payments, checkout, orders |
| Validation, buyer previews, 3D structure, sightline scores | Sales channels and buyer access |
| Review and publication of an approved revision | Creating events or Seasons |
| Event Configurations: create, review, publish, bind to an event | Webhooks, API keys, members, billing |
| Live event controls, when allowed: open, close or hide sections, block seats, move an event to the latest chart | |

An agent on this server can prepare and publish the map buyers use, but it
cannot hold or sell a seat. Selling stays with the Server API and the host's
checkout.

## Scope and permissions

- The admin approves each connection and chooses **one chart** (the default) or
  **every chart in this workspace**.
- **Manage live events** is off unless the admin turns it on. Live controls
  never change a hold or a booking, and blocking refuses the whole change if a
  seat is held or booked.
- Publishing and approval tools need publish permission. Reference, blueprint
  and capacity tools need the reference-chart feature; Event Configurations need
  that module on the account.
- Access tokens expire after an hour. Each connection can make up to 300 tool
  calls per minute.
- The server lists only the tools a connection may use (up to 120, grouped by
  area in the live page). Call `get_capabilities` for the actual list; never
  assume a tool exists.

## Workflow

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
