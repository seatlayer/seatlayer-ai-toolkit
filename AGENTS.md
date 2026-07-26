# Toolkit maintenance

SeatLayer's live Markdown documentation is the product source of truth. Keep
this repository focused on agent workflow, safety invariants, diagnostics, and
installation; do not duplicate the complete documentation corpus.

When product behavior changes:

1. Update the public documentation first.
2. Update only the toolkit routes or invariants affected by that change.
3. Add a focused doctor fixture for every new deterministic diagnostic.
4. Run `npm run validate`.
5. Run the doctor against a real integration before release.

Keep the toolkit dependency-free unless a dependency is essential. Commands
must be safe by default, diagnostics must be read-only, and Designer MCP must
never publish without explicit user authorization.
