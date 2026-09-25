# SeatLayer AI Toolkit for Coding Agents

[![Validate](https://github.com/seatlayer/seatlayer-ai-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/seatlayer/seatlayer-ai-toolkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-111827.svg)](LICENSE)

Agent skills, plugins and a read-only safety scanner that help Claude Code,
Codex, GitHub Copilot and other coding agents add SeatLayer seat maps and
reserved-seat checkout to an existing application. It covers the JavaScript and
framework packages, the mobile SDKs, the server SDKs, Hosted Ticketing, and
organizer tools, and it connects the SeatLayer MCP servers. SeatLayer is seating
chart and reserved-seat ticketing software built for venues up to stadium scale.

The toolkit does not replace the
[SeatLayer developer documentation](https://docs.seatlayer.io/). It teaches an
agent how to inspect a repository, select the right SeatLayer surface, load the
smallest relevant live documentation set, implement the integration, and prove
the result.

[Build SeatLayer integrations with agents](https://docs.seatlayer.io/agents/overview/) ·
[SeatLayer developer documentation](https://docs.seatlayer.io/) ·
[SeatLayer reserved-seating platform](https://seatlayer.io/) ·
[SeatLayer buyer seat-map demos](https://app.seatlayer.io/demo) ·
[SeatLayer for developers](https://seatlayer.io/developers/) ·
[SeatLayer on GitHub](https://github.com/seatlayer)

**Start here:** [Quickstart](https://docs.seatlayer.io/start/quickstart/) · [Holds and checkout](https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/) · [Build integrations with agents](https://docs.seatlayer.io/agents/overview/) · [SDK catalog](https://docs.seatlayer.io/sdk-catalog.json) · [Pricing](https://seatlayer.io/pricing/): $0 entry, 100 free confirmed-sold-seat credits per organization each month, then $0.10 down to $0.05 a credit, and credits never expire.

## Scale evidence

Benchmarked on public 100,000-, 150,000- and 200,000-seat venue fixtures on 15 September 2026: 200,000 seats chart-ready in 1.95 s, desktop, local production build. Fixtures, method and run logs: https://github.com/seatlayer/seatlayer-performance. Live 200,000-seat stadium demo: https://app.seatlayer.io/demo/play/century-stadium-200k. This is renderer evidence, not a concurrent-buyer claim.

## Choose the integration before the package

| Outcome | Start here | Commerce owner |
|---|---|---|
| Share a complete booking page | Hosted Event Page | SeatLayer managed ticketing |
| Put managed checkout in an existing site | Managed embed | SeatLayer managed ticketing |
| Publish one or many events as a site | Organizer Website | SeatLayer managed ticketing |
| Add seating to an existing checkout | `SeatPicker` or `SeatingChart` | Your platform |
| Sell a private, partner, sponsor, or presale allocation | Hosted access link or buyer access session | Depends on the selected product profile |
| Build a mobile buyer experience | React Native, Flutter, iOS, or Android SDK | Your platform |
| Add organizer chart or event operations | Embedded Designer or control room | Your platform |

Read [Choose an integration](https://docs.seatlayer.io/start/choose-an-integration/)
before implementing. A managed hosted surface does not require a host booking
endpoint. A platform/custom checkout does.

## SeatLayer package ecosystem

The [developer documentation](https://docs.seatlayer.io/) is the authoritative
contract. Registry pages are the authority for the latest published version.

### Buyer and mobile SDKs

| Surface | Package or source | Documentation |
|---|---|---|
| JavaScript | [`@seatlayer/js`](https://www.npmjs.com/package/@seatlayer/js) | [JavaScript seat map SDK](https://docs.seatlayer.io/buyer-sdk/install/) |
| React | [`@seatlayer/react`](https://www.npmjs.com/package/@seatlayer/react) | [React seating chart components](https://docs.seatlayer.io/buyer-sdk/react/) |
| Vue | [`@seatlayer/vue`](https://www.npmjs.com/package/@seatlayer/vue) | [Vue seating chart components](https://docs.seatlayer.io/buyer-sdk/vue/) |
| Angular | [`@seatlayer/angular`](https://www.npmjs.com/package/@seatlayer/angular) | [Angular seating chart components](https://docs.seatlayer.io/buyer-sdk/angular/) |
| React Native | [`@seatlayer/react-native`](https://www.npmjs.com/package/@seatlayer/react-native) | [React Native seat map SDK](https://docs.seatlayer.io/buyer-sdk/react-native/) |
| Flutter | [`seatlayer`](https://pub.dev/packages/seatlayer) | [Flutter seat picker SDK](https://docs.seatlayer.io/buyer-sdk/flutter/) |
| iOS | [Swift package](https://github.com/seatlayer/seatlayer-ios) | [Swift and SwiftUI seat maps](https://docs.seatlayer.io/buyer-sdk/ios/) |
| Android | [Maven Central package](https://central.sonatype.com/artifact/io.seatlayer/seatlayer-android) | [Kotlin and Compose seat maps](https://docs.seatlayer.io/buyer-sdk/android/) |

### Server SDKs

Server SDKs are secret-key packages. Never bundle them into buyer-facing code.

| Language | Package | Source | Documentation |
|---|---|---|---|
| Node.js | [`@seatlayer/server`](https://www.npmjs.com/package/@seatlayer/server) | [seatlayer-node](https://github.com/seatlayer/seatlayer-node) | [Node.js seat booking SDK](https://docs.seatlayer.io/server-sdk/node/) |
| Python | [`seatlayer`](https://pypi.org/project/seatlayer/) | [seatlayer-python](https://github.com/seatlayer/seatlayer-python) | [Python seat booking SDK](https://docs.seatlayer.io/server-sdk/python/) |
| PHP | [`seatlayer/seatlayer-php`](https://packagist.org/packages/seatlayer/seatlayer-php) | [seatlayer-php](https://github.com/seatlayer/seatlayer-php) | [PHP seat booking SDK](https://docs.seatlayer.io/server-sdk/php/) |
| Java | [`io.seatlayer:seatlayer-java`](https://central.sonatype.com/artifact/io.seatlayer/seatlayer-java) | [seatlayer-java](https://github.com/seatlayer/seatlayer-java) | [Java seat booking SDK](https://docs.seatlayer.io/server-sdk/java/) |
| Go | [`github.com/seatlayer/seatlayer-go`](https://pkg.go.dev/github.com/seatlayer/seatlayer-go) | [seatlayer-go](https://github.com/seatlayer/seatlayer-go) | [Go seat booking SDK](https://docs.seatlayer.io/server-sdk/go/) |
| Ruby | [`seatlayer`](https://rubygems.org/gems/seatlayer) | [seatlayer-ruby](https://github.com/seatlayer/seatlayer-ruby) | [Ruby seat booking SDK](https://docs.seatlayer.io/server-sdk/ruby/) |
| .NET | [`SeatLayer`](https://www.nuget.org/packages/SeatLayer) | [seatlayer-dotnet](https://github.com/seatlayer/seatlayer-dotnet) | [.NET seat booking SDK](https://docs.seatlayer.io/server-sdk/dotnet/) |

[Server SDK installation](https://docs.seatlayer.io/server-sdk/install/) ·
[SeatLayer on GitHub](https://github.com/seatlayer)

## Agent tools for integration, chart design, and seat selection

Choose the interface for the task:

- **Integration knowledge:** the public, anonymous documentation MCP endpoint at
  `https://docs.seatlayer.io/mcp` (11 read-only tools, such as `search_docs`,
  `get_page` and `sdks`) and [Markdown documentation index](https://docs.seatlayer.io/llms.txt)
  help an agent find the current API and SDK guidance.
- **Chart authoring:** [Designer MCP](https://docs.seatlayer.io/agents/designer-mcp/)
  connects an authorized agent to one chart or a workspace. It builds, traces,
  validates, reviews and publishes charts, manages Event Configurations, and,
  when the admin allows it, controls live sections and seat blocks. It cannot
  hold, book or refund seats. Use the documented approval flow before
  publishing changes.
- **Buyer seat selection:** [WebMCP seat-selection tools](https://docs.seatlayer.io/buyer-sdk/webmcp-agent-tools/)
  let a compatible browser assistant describe a chart, find seats, and update
  the selection when the buyer integration opts in. Payment remains in the
  host checkout flow.

This toolkit helps implement those integrations. The documentation MCP,
Designer MCP, and buyer WebMCP tools are separate interfaces.

## What is included

- `integrate-seatlayer`: a portable Agent Skill for implementation, review,
  troubleshooting, and go-live work. Its references route an agent to the live
  pages for event setup and ticket limits, the 14 payment gateways, 3D views,
  resale, Seasons and Season Best Available, API errors and rate limits, the 40
  webhook events, SeatManager hover prices, Click the plan, and migration from
  seats.io.
- `seatlayer-ai doctor`: deterministic checks for exposed credentials,
  server packages in client code, browser-side booking, unsafe buyer-access
  token handling, missing idempotency and conflict handling, unaudited channel
  overrides, and weak webhook verification.
- Claude Code commands for setup, integration, diagnosis, and verification.
- Codex and Claude plugin manifests.
- MCP configuration for both servers: the anonymous documentation MCP and the
  OAuth Designer MCP. Publication always requires an explicit human decision.
- A Claude Code hook that adds a short SeatLayer reminder to the assistant's
  context when an edit touches SeatLayer code. It never blocks or approves an
  edit.

## Quick start

Clone the repository:

```bash
git clone https://github.com/seatlayer/seatlayer-ai-toolkit.git
cd seatlayer-ai-toolkit
```

### Codex

Install the plugin from this repository's marketplace:

```bash
codex plugin marketplace add seatlayer/seatlayer-ai-toolkit
codex plugin add seatlayer@seatlayer-ai-toolkit
```

Or install only the skill into your personal Codex skills directory from a
clone:

```bash
node scripts/install.mjs --target codex
```

Then ask:

```text
Use $integrate-seatlayer to add reserved seating to this repository.
```

### Claude Code

Install the plugin from this repository's marketplace:

```bash
claude plugin marketplace add seatlayer/seatlayer-ai-toolkit
claude plugin install seatlayer@seatlayer-ai-toolkit
```

Or load a local clone for one session:

```bash
claude --plugin-dir /absolute/path/to/seatlayer-ai-toolkit
```

Available commands:

```text
/seatlayer:setup
/seatlayer:integrate
/seatlayer:doctor
/seatlayer:verify
```

### GitHub Copilot

Install the portable skill into a project:

```bash
node scripts/install.mjs --target github --project /path/to/project
```

This writes `.github/skills/integrate-seatlayer/` without modifying application
code.

### Any coding agent

Give the agent these two resources:

- `https://docs.seatlayer.io/llms.txt`
- `skills/integrate-seatlayer/SKILL.md`

The complete documentation corpus is available at
`https://docs.seatlayer.io/llms-full.txt`, but focused page routes are preferred
to avoid unnecessary context.

## Diagnose an existing integration

Run the read-only scanner:

```bash
node scripts/doctor.mjs /path/to/project
```

For machine-readable output:

```bash
node scripts/doctor.mjs /path/to/project --json
```

The scanner never reads files outside the target repository, never prints
environment-variable values, and ignores dependencies and build output.

## Core safety boundaries

- Choose managed ticketing or platform/custom commerce before choosing an SDK.
- Managed hosted checkout owns payment, Orders, tickets, and booking; do not add
  a duplicate host booking endpoint.
- In platform/custom commerce, the browser selects and holds while a trusted
  server inspects and books.
- `SEATLAYER_SECRET_KEY` never enters browser code.
- Payment amounts come from trusted server data, not browser input.
- `bookingRef` is the host order identifier and is reused for safe retries.
- Inventory conflicts and expired holds are normal recovery paths.
- Buyer access tokens are event- and origin-bound capabilities. Keep them in
  memory, never in storage, URLs, logs, analytics, or exception text.
- A private event is token-gated and has **no public link**; it is not hard-off.
- Listing an event on an Organizer Website makes it discoverable on that public
  Website and must be an explicit organizer decision.
- Webhook signatures are verified from the raw request body.

The live documentation is authoritative when it conflicts with toolkit
guidance:

- [Build SeatLayer integrations with agents](https://docs.seatlayer.io/agents/overview/)
  for the overview an agent should read first.
- [Follow the agent integration workflow](https://docs.seatlayer.io/agents/integrate-seatlayer/)
  for the step order this toolkit's skill implements.
- [Run the complete checkout example](https://docs.seatlayer.io/examples/complete-checkout/)
  to connect a buyer hold id to payment and idempotent booking.
- [Sell private, partner, and presale allocations](https://docs.seatlayer.io/integrations/private-and-partner-sales/)
  when the event is token-gated rather than public.
- [Install a SeatLayer server SDK](https://docs.seatlayer.io/server-sdk/install/)
  for the trusted side that inspects holds and books.
- [Review SeatLayer integration best practices](https://docs.seatlayer.io/integrations/best-practices/)
  before going live.

## MCP servers

The included `.mcp.json` configures two remote Streamable HTTP servers:

- `seatlayer-docs` at `https://docs.seatlayer.io/mcp`: public, anonymous,
  read-only product knowledge and documentation search.
- `seatlayer-designer` at `https://mcp.seatlayer.io/mcp`: chart authoring with
  OAuth 2.1 and PKCE, scoped to one chart or one workspace. Availability and
  publish permission are shown on the dashboard's Agent connections page.

The integration skill must not use Designer MCP unless the task involves chart
authoring or review. It must never publish without the user's explicit
authorization.

## Development

Requirements: Node.js 18 or newer.

```bash
npm run validate
npm run check:docs
```

The first command validates manifests, the portable skill, the hook, installer
behavior, and deterministic diagnostics. The second resolves every referenced SeatLayer
documentation URL. The repository intentionally has no runtime dependencies.

## License

MIT © SeatLayer
