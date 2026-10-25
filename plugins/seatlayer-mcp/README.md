# SeatLayer MCP skills for Claude Code

Six workflows that help Claude Code run SeatLayer through the
[SeatLayer MCP](https://docs.seatlayer.io/agents/designer-mcp/): build and
publish seating charts, and run events on them. The plugin is optional. You
can connect the SeatLayer MCP without it.

| Skill | What it does |
|---|---|
| `block-seats-safely` | Finds the event, checks the seats, plans a block, unblock, reservation or section change, shows you the summary and applies it only after your yes. It never touches held or booked seats. |
| `apply-chart-feedback` | Turns a client's comments on a chart into edits, checks them, publishes after your review and, if you want, moves events on sale to the new version. |
| `client-report` | Writes a client-facing summary from the event's report, seats and History on a read-only connection. A free event gets no prices. |
| `publish-and-apply` | Validates, previews and publishes a chart with your approval, then moves the events you choose onto it, with a plan for their prices. |
| `event-day-ops` | Door and attendance counts, closing sections, blocking seats, stopping sales, finding orders, resending tickets, and refund or cancellation requests an admin approves. |
| `trace-floor-plan` | Builds a chart from a floor-plan image, confirming every count and label with you. |

## Install

```bash
claude plugin marketplace add seatlayer/seatlayer-ai-toolkit
claude plugin install seatlayer-mcp@seatlayer-ai-toolkit
```

Inside Claude Code the same commands work as `/plugin marketplace add …` and
`/plugin install …`. Update with
`claude plugin update seatlayer-mcp@seatlayer-ai-toolkit`.

## Connect the SeatLayer MCP

The server is `https://mcp.seatlayer.io/mcp` (Streamable HTTP, OAuth).

```bash
claude mcp add --transport http seatlayer https://mcp.seatlayer.io/mcp
```

Then run `/mcp` in Claude Code and sign in to SeatLayer. One tap on **Allow**
gives the agent your workspace and every permission; **Customize** on that
screen narrows it to one chart or turns permissions off.

For reports and lookups, a second read-only connection keeps writes out:

```bash
claude mcp add --transport http seatlayer-read "https://mcp.seatlayer.io/mcp?tools=events&readonly=1"
```

| URL | Lists |
|---|---|
| `https://mcp.seatlayer.io/mcp` | Every tool the connection allows (160 with every permission) |
| `…/mcp?tools=build` | The 63 chart tools: build, edit, price, check, publish |
| `…/mcp?tools=events` | Events on sale: seats, plans, reports, prices, sales, channels |
| `…/mcp?tools=discover` | About ten tools, the rest reached through search, for small context budgets |
| `…/mcp?readonly=1` | Only tools that read; any write is refused |

Connecting from Claude, ChatGPT or another app instead:
https://docs.seatlayer.io/agents/connect-claude/ and
https://docs.seatlayer.io/agents/connect-chatgpt/.

## How the skills behave

- **It asks you first.** For an event on sale, the agent shows a plan and its
  summary and applies it only after your yes in the chat. A yes covers that
  one plan; if the seats change first, it plans again.
- **Refunds need an admin.** The agent can't refund or charge anyone. It can
  ask for a refund or cancellation, and an admin approves it in Orders.
- **Read-only when a task only reads.** Reports and lookups use a read-only
  connection and the smallest toolset that has the tools.
- **The browser is only for looking.** Never for a change the MCP can make.

Your SeatLayer admins get an email about each change an agent makes, and the
event's History names the agent.

## Licence

MIT
