# SeatLayer MCP

Use the SeatLayer MCP for chart and event work: building, tracing, checking
and publishing charts, and, when the connection allows it, setting up events,
prices, sales channels, live seat blocks, orders and reports. Ordinary SDK and
booking integration does not need it.

The remote resource is `https://mcp.seatlayer.io/mcp`. It uses Streamable HTTP,
OAuth 2.1 authorization code flow with PKCE S256, the `resource` parameter, and
rotating refresh tokens. This toolkit's `.mcp.json` names the server `seatlayer-designer`. The dashboard's **Agent connections** page
shows the URL and publish permission for each environment. Setup guides:
`https://docs.seatlayer.io/agents/connect-claude/index.md`,
`https://docs.seatlayer.io/agents/connect-codex/index.md` and
`https://docs.seatlayer.io/agents/connect-chatgpt/index.md`.

The public knowledge MCP at `https://docs.seatlayer.io/mcp` is a different
server: anonymous, read-only product knowledge and documentation search. Use it
for integration questions, not chart or event changes.

## What it covers

| Covered | Not covered |
|---|---|
| Building and editing charts: sections, rows, seats, tables, booths, GA areas, floors, zones, text, shapes, categories, theme | Selling a seat or holding one for a buyer: buyers buy through the checkout |
| Tracing a chart from a reference image, with confirmed counts and labels | Refunding or charging anyone: a refund or cancellation is only a request an org admin approves in Orders |
| Validation, buyer previews, 3D structure, sightline scores | Payments, checkout settings, promo codes and fees |
| Review and publication of an approved revision | Seasons, and cancelling a whole event with its refunds |
| Event set-up, when allowed: create, edit and duplicate events, open, close and reopen sales | Webhooks, API keys, members, billing |
| Live event controls, when allowed: open, close or hide sections, block and reserve seats, change seat categories, move an event to the latest chart | |
| Prices, when allowed: event and single-seat prices, ticket releases, when sections go on sale, checkout hold time, how tables sell | |
| Sales channels, when allowed: allocations, channel prices and sale routes, buyer links and partner report links | |
| Orders, when allowed: find and read orders, resend tickets, ask an admin to refund or cancel | |
| Reports, when allowed: sales, money, door counts and the event log | |

An agent on this server can prepare and publish the map buyers use and run
events, but it cannot sell a seat, and it cannot refund or charge anyone.
Selling stays with the Server API and the checkout.

## Scope and permissions

- An admin approves each connection on a consent screen. One tap on **Allow**
  grants the workspace shown and every permission; **Customize** narrows it to
  one chart or turns permissions off.
- Grant the least an agent needs: use **Customize** to choose one chart or turn
  permissions off, and connect with `?readonly=1` when the agent only reports.
- The event permissions are: **Create and run events**, **Set prices and
  releases**, **Manage live events**, **Manage sales channels**, **Look after
  orders**, **Read reports** and **Change seat categories**.
- A change to an event on sale is planned first. Show the person the plan, and
  apply it only after their yes to that plan. A yes given before the plan is not
  a yes to it. Held and booked seats never change.
- Publishing and approval tools need publish permission. Tracing a floor
  plan needs the reference-chart feature on the account.
- Access tokens expire after an hour and refresh tokens rotate.
- The server lists only what a connection may use. Ask it what the connection
  allows first; never assume a tool exists.

## Toolsets

Everything listed is sent to the model on every turn. A host can
connect with a smaller set by adding `?tools=` to the server URL:

| URL | Use it to |
|---|---|
| `https://mcp.seatlayer.io/mcp?tools=build` | Build, edit, price, check and publish charts |
| `?tools=build,trace` | The same, and build from a floor-plan image |
| `?tools=build,3d` | The same as build, plus seat heights, sightlines and seat views |
| `?tools=events` | Event set-up, live controls, reports, prices, orders and the channel reads, plus chart access. Use `?tools=build,events` to edit the chart as well |
| `?tools=channels` | Sales channels only |
| `?tools=discover` | A short list; the AI looks up the rest when a request needs it |
| `?readonly=1` | Only tools that read; a call that changes a chart or an event is refused. Combines with a set, for example `?tools=events&readonly=1` |
| `https://mcp.seatlayer.io/mcp` or `?tools=all` | Every tool the connection may use |

Sets combine with commas. A toolset only narrows what is listed (`readonly=1`
also refuses writes); the connection's permissions still decide what any call
may do. Chat hosts such as Claude and ChatGPT use `?tools=build`; a coding agent
such as Codex can use the plain URL.

The server also offers ready-made jobs: build a venue from a description, change
an existing chart, trace a floor plan, check and publish the chart, apply chart
feedback, publish and apply, block seats safely, event-day operations and client
report.

## Build a new venue from a description

Use the `seatlayer-venue-spec` skill in this toolkit. The agent writes the whole
venue as one short JSON Venue Spec (categories, prices, stage, rows, tables,
standing, booths, landmarks, all in words, never coordinates), checks it
first, then builds it in one step.
Every problem comes back with the field that needs fixing. The same file can be
pasted into the Designer (**New from → Paste from an AI…**) when no connection
is available. Format: `https://docs.seatlayer.io/agents/venue-spec/index.md`.

## Workflow for tracing and review

1. Ask the server what this connection allows; do not assume tools or schemas.
2. Authorize the intended chart or workspace scope.
3. Treat uploaded plans as private evidence, not authoritative inventory.
4. Inspect required overview and detail tiles.
5. Record semantic meaning, confirmed labels/counts, confidence, and open
   questions.
6. Prefer semantic intents and deterministic SeatLayer compilers over invented
   coordinates. Make each change from the latest read.
7. Validate and render every floor after bounded changes.
8. Prepare the exact immutable revision for review.
9. Publish only after the user explicitly approves that unchanged revision.

For a person working in the Designer instead of an agent, **Click the plan**
turns a floor plan image or PDF into blocks of seats, rows, or traced sections:
`https://docs.seatlayer.io/designer/reference-plan-import/index.md`.

## Guardrails

- Do not enumerate unrelated charts, users, buyers, billing, or API keys.
- Read buyers' details only when the task needs an order.
- Do not use unconfirmed image counts, labels, accessibility, categories, or
  pricing as sellable facts.
- Do not expose private reference images in buyer output.
- Treat machine validation as necessary but insufficient for visual approval.
- Any mutation after review invalidates the prior approval.
- Never give the model a SeatLayer secret API key.

Live source:
`https://docs.seatlayer.io/agents/designer-mcp/index.md`.
