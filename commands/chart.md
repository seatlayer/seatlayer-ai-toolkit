---
description: Build a SeatLayer seating chart from a description of the venue
argument-hint: "[the venue: rows, tables, standing, prices, stage, bar, exits]"
allowed-tools: Read, Write
---

# Build a seating chart

Use the `seatlayer-venue-spec` skill for this venue: $ARGUMENTS

Write the Venue Spec. When the `seatlayer-designer` MCP server is connected,
check it with `build_from_venue_spec` and `checkOnly: true`, compare the summary
with what was asked, and build it only after telling the user it replaces the
current draft. Without the connection, give the JSON in one code block and say
where to paste it in the Designer.

Ask a question first only when a count is missing: rows and seats per row,
tables and chairs, standing capacity, or booths. Never publish without the
user's explicit decision.
