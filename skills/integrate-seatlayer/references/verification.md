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

## Required behavior matrix

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

## Manual test-mode journey

1. Open a test event at mobile and desktop widths.
2. Select reserved seats and any required GA/ticket tiers.
3. Confirm hold ownership and expiry behavior.
4. Submit checkout once and observe the host order state.
5. Retry the same request with the same order identity.
6. Force or simulate an expiry and a conflict.
7. Confirm useful buyer recovery and no duplicate payment.
8. Inspect logs and analytics for identifiers without secrets or sensitive
   payloads.

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
