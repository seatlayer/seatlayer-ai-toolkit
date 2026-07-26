# Designer MCP

Use Designer MCP only for chart authoring or review. Ordinary SDK and booking
integration does not need it.

The remote resource is `https://mcp.seatlayer.io/mcp`. It uses Streamable HTTP,
OAuth 2.1 authorization code flow with PKCE S256, and a chart-scoped
authorization boundary.

## Workflow

1. Call `get_capabilities`; do not assume deployed tools or schemas.
2. Authorize the intended chart/workspace scope.
3. Treat uploaded plans as private evidence, not authoritative inventory.
4. Inspect required overview and detail tiles.
5. Record semantic meaning, confirmed labels/counts, confidence, and open
   questions.
6. Prefer semantic intents and deterministic SeatLayer compilers over invented
   coordinates.
7. Validate and render every floor after bounded changes.
8. Prepare the exact immutable revision for review.
9. Publish only after the user explicitly approves that unchanged revision.

## Guardrails

- Do not enumerate unrelated charts, users, buyers, billing, or API keys.
- Do not use unconfirmed image counts, labels, accessibility, categories, or
  pricing as sellable facts.
- Do not expose private reference images in buyer output.
- Treat machine validation as necessary but insufficient for visual approval.
- Any mutation after review invalidates the prior approval.

Live source:
`https://docs.seatlayer.io/agents/designer-mcp/index.md`.
