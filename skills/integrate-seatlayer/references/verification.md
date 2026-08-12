# Verification and evidence

## Automated checks

Run the host repository's native commands rather than substituting a new test
stack:

1. typecheck or compile;
2. unit tests;
3. lint and formatting checks;
4. production build;
5. server route/service tests;
6. browser or integration tests already used by the repository;
7. `node <skill-root>/scripts/doctor.mjs <repository-root>`.

Inspect the production browser bundle or build manifest when available to
confirm no server credential or server-only module is present.

## Managed hosted-checkout matrix

| Case | Evidence |
|---|---|
| Direct booking link | Correct event opens and completes SeatLayer-managed checkout |
| Managed embed | Correct event opens once; responsive picker remains fully visible |
| Organizer Website | Listing is explicit and the exact event/card route opens |
| Hosted default | Booking remains usable without optional Event Page design |
| Payment and return | Test payment creates one Order and returns to the branded success path |
| Failure/cancel | Buyer can return or retry without a duplicate Order or stale hold |
| Cold/mobile load | Useful loading state and complete picker at mobile and desktop widths |

Do not require or create a host booking endpoint for this profile.

## Platform/custom-commerce matrix

| Case | Evidence |
|---|---|
| Successful checkout | One host order/payment and one stable booking reference |
| Hold expires before payment | No charge; buyer can reselect |
| Inventory conflict | No partial booking; useful recovery |
| Duplicate request | Same `bookingRef`; no duplicate charge |
| Payment failure | No booking; hold releases or expires safely |
| Payment succeeds, booking fails | Durable compensation or operator-recovery state |
| Missing secret | Startup/route fails safely without exposing configuration |
| Test/live mismatch | Clear configuration failure |
| Browser build | No secret value or server-only booking helper |
| Mobile/keyboard | Picker and surrounding checkout remain operable |
| Webhook replay | Occurrence is deduplicated |
| Invalid webhook signature | No business state mutation |

## Private and channel-access matrix

| Case | Evidence |
|---|---|
| No public grant | Buyer sees no public link; inventory remains available to authorized buyers |
| Correct entitlement | Exact channel allocation is visible and selectable |
| Wrong origin/event | Access fails closed without revealing or widening inventory |
| Expired/revoked token | Refresh or re-authentication runs deliberately |
| Exhausted allocation | Buyer gets allocation-specific recovery, not a false whole-event “sold out” |
| Token handling | No token or hosted capability URL in storage, URLs, logs, analytics, or errors |
| Channel override | Genuine back-office purpose and audit reason are present |
| Website listing | Organizer explicitly accepted public Website discoverability |

## Manual test-mode journey

1. Open the selected surface with a test event at mobile and desktop widths.
2. Confirm the exact event, access scope, loading state, and complete picker.
3. Select reserved seats and any required GA/ticket tiers without creating
   unnecessary holds.
4. For managed checkout, use the safe test-payment path and confirm one hosted
   Order and branded return. For custom commerce, inspect the hold, submit once,
   and observe one host order and stable booking reference.
5. Exercise only safe expiry, conflict, cancel, or access-denial paths available
   in the test environment.
6. Inspect bundles, storage, URLs, logs, and analytics for secrets, server SDKs,
   buyer tokens, or hosted capability URLs.

## Handoff evidence

Report:

- exact commands and summarized results;
- manual steps completed and not completed;
- test identifiers without secrets;
- changed files;
- assumptions;
- production configuration still required;
- skipped checks and the reason; and
- operational follow-up for webhooks, monitoring, deployment, and recovery.
