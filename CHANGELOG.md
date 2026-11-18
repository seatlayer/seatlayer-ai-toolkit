# Changelog

## 0.5.0 (18 November 2026)

- Updated for `@seatlayer/js`, `@seatlayer/react`, `@seatlayer/vue` and `@seatlayer/angular`
  0.112.0, the seven server SDKs at 0.9.0, React Native 0.4.0, Flutter 0.12.0, iOS 0.3.4 and
  Android 0.3.5.
- SeatLayer MCP: charts and events, the toolsets and `?readonly=1`, and the connection scope as the
  docs describe them.
- Safety contract: request budgets as the docs state them, and hosted checkout in the pickers (do
  not book from a hand-off callback when SeatLayer's checkout takes the payment).
- Integration map: SeatLayer-checkout events, the Orders API, ticket sites, season pages, holders,
  prices, event series and the agent connect guides. Season tickets are in the web and server
  SDKs.
- Doctor: checks for server SDK bookings, secret keys behind public prefixes, secrets in Swift,
  Kotlin and Dart files, webhook verification through the server SDKs, options that do nothing in
  0.112.0 and older package versions, with seven new tests.
- Venue Spec skill: the newer format fields and a seventh example.

Earlier versions are in the Git history.
