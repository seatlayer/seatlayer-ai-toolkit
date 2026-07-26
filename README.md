# SeatLayer AI Toolkit

Agent skills, diagnostics, and optional Designer MCP configuration for adding
reserved seating to an existing application.

The toolkit does not replace the
[SeatLayer developer documentation](https://docs.seatlayer.io/). It teaches an
agent how to inspect a repository, select the right SeatLayer surface, load the
smallest relevant live documentation set, implement the integration, and prove
the result.

## What is included

- `integrate-seatlayer` — a portable Agent Skill for implementation, review,
  troubleshooting, and go-live work.
- `seatlayer-ai doctor` — deterministic checks for exposed credentials,
  browser-side booking, missing idempotency and conflict handling, and weak
  webhook verification.
- Claude Code commands for setup, integration, diagnosis, and verification.
- Codex and Claude plugin manifests.
- Optional remote Designer MCP configuration. OAuth remains chart-scoped and
  publication always requires an explicit human decision.

## Quick start

Clone the repository:

```bash
git clone https://github.com/paiteq/seatlayer-ai-toolkit.git
cd seatlayer-ai-toolkit
```

### Codex

Install the skill into your personal Codex skills directory:

```bash
node scripts/install.mjs --target codex
```

Then ask:

```text
Use $integrate-seatlayer to add reserved seating to this repository.
```

### Claude Code

Load the complete plugin:

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

## Core safety boundary

- The browser selects and holds; a trusted server inspects and books.
- `SEATLAYER_SECRET_KEY` never enters browser code.
- Payment amounts come from trusted server data, not browser input.
- `bookingRef` is the host order identifier and is reused for safe retries.
- Inventory conflicts and expired holds are normal recovery paths.
- Webhook signatures are verified from the raw request body.

The live documentation is authoritative when it conflicts with toolkit
guidance:

- [Build with agents](https://docs.seatlayer.io/agents/overview/)
- [Agent integration workflow](https://docs.seatlayer.io/agents/integrate-seatlayer/)
- [Complete checkout](https://docs.seatlayer.io/examples/complete-checkout/)
- [Integration best practices](https://docs.seatlayer.io/integrations/best-practices/)

## Designer MCP

The included `.mcp.json` points to SeatLayer's remote Streamable HTTP MCP
resource. It uses OAuth 2.1 with PKCE and a chart-scoped authorization boundary.
Availability and publish capability are shown in the SeatLayer dashboard.

The integration skill must not use Designer MCP unless the task involves chart
authoring or review. It must never publish without the user's explicit
authorization.

## Development

Requirements: Node.js 18 or newer and Python 3 for the optional upstream skill
and plugin validators.

```bash
npm run validate
```

The repository intentionally has no runtime dependencies.
