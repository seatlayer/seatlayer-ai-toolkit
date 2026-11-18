# Toolkit maintenance

SeatLayer's live Markdown documentation is the product source of truth. Keep
this repository focused on agent workflow, safety invariants, diagnostics, and
installation; do not duplicate the complete documentation corpus.

When product behavior changes:

1. Update the public documentation first.
2. Update only the toolkit routes or invariants affected by that change.
3. Add a focused doctor fixture for every new deterministic diagnostic.
4. When a SeatLayer package releases, update `CHECKED_RELEASES` in
   `skills/integrate-seatlayer/scripts/doctor.mjs` and its fixture.
5. Run `npm run validate`.
6. Run the doctor against a real integration before release.

Keep the toolkit dependency-free unless a dependency is essential. Commands
must be safe by default, diagnostics must be read-only, and the SeatLayer MCP
must never publish a chart or change an event on sale without the user's
explicit approval.
