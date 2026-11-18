# Integration map

Select the smallest surface that satisfies the host product. Load only the
listed live Markdown pages plus any exact reference page discovered through
`llms.txt`.

## Foundations

| Need | Live documentation |
|---|---|
| Product model | `https://docs.seatlayer.io/start/overview/index.md` |
| Integration selection | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| One Event, a run of performances, or a renewable Season | `https://docs.seatlayer.io/start/inventory-models/index.md` |
| Which SDK or API for the host stack | `https://docs.seatlayer.io/sdks/index.md` |
| First complete loop | `https://docs.seatlayer.io/start/quickstart/index.md` |
| Authentication and environments | `https://docs.seatlayer.io/start/authentication/index.md` |
| Production launch | `https://docs.seatlayer.io/start/going-live/index.md` |

## Commerce and distribution

| Host outcome | Product/surface | Live documentation |
|---|---|---|
| SeatLayer owns checkout, Orders, tickets, refunds, and Door | Hosted Ticketing | `https://docs.seatlayer.io/start/first-event/index.md` |
| Hosted Ticketing overview for organizers | Hosted Ticketing | `https://docs.seatlayer.io/sell/overview/index.md` |
| Free or paid, payment account, booking form, ticket limits, hold time | Event setup | `https://docs.seatlayer.io/sell/event-setup/index.md` |
| Connect one of the 14 payment gateways | Payments | `https://docs.seatlayer.io/sell/connect-payments/index.md` |
| Buyer checkout journey and return page | Hosted checkout | `https://docs.seatlayer.io/sell/hosted-checkout/index.md` |
| Refunds and cancellations | Hosted Ticketing | `https://docs.seatlayer.io/sell/refunds-and-cancellations/index.md` |
| Counter sales and door scanning | Box office and Door | `https://docs.seatlayer.io/sell/box-office/index.md`, `https://docs.seatlayer.io/sell/door-check-in/index.md`, `https://docs.seatlayer.io/sell/staff-roles/index.md` |
| Share one complete buyer destination | Hosted Event Page | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| Put managed checkout in an existing site | Managed embed | `https://docs.seatlayer.io/integrations/iframe/index.md` |
| Sell from the host's own page with SeatLayer checkout and no backend | `SeatPicker` with `checkout: 'hosted'` | `https://docs.seatlayer.io/integrations/iframe/index.md` |
| Paste one tag to sell a date, a run of dates or a short pass | What's on widget | `https://docs.seatlayer.io/buyer-sdk/whats-on/index.md` |
| Publish an organizer site | Organizer Website | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| Event pages in the organizer's brand, on a SeatLayer address or their own domain | Ticket site | `https://docs.seatlayer.io/sell/ticket-site/index.md` |
| Create SeatLayer-checkout or free events from a server, assign the gateway, go live, booking fee and discount codes | Hosted Ticketing by API | `https://docs.seatlayer.io/server-api/event-checkout/index.md` |
| Read SeatLayer orders; refund, cancel or resend an event order from a server | Orders API | `https://docs.seatlayer.io/server-api/orders/index.md` |
| Sell and run a season from the dashboard and SeatLayer pages | Seasons | `https://docs.seatlayer.io/sell/seasons/index.md`, `https://docs.seatlayer.io/sell/season-seats/index.md` |
| Host owns commerce and fulfilment | Platform/SDK | `https://docs.seatlayer.io/integrations/platforms/index.md` |
| Private, partner, sponsor, or presale inventory | Sales channel | `https://docs.seatlayer.io/integrations/private-and-partner-sales/index.md` |
| Existing site on WordPress | WordPress plugin | `https://docs.seatlayer.io/integrations/wordpress/index.md` |
| Moving from seats.io | Migration | `https://docs.seatlayer.io/integrations/migrate-from-seatsio/index.md` |

Hosted Ticketing supports 14 payment gateways: Stripe, PayPal, Square,
Braintree, Authorize.Net, Checkout.com, Mollie, Razorpay, Tap, Mercado Pago,
Xendit, Flutterwave, Paystack and iyzico. Buyers pay into the organizer's own
account. Ticket limits (`maxTicketsPerOrder`, `maxTicketsPerBuyer`) are event
settings, not checkout code.

For Hosted Ticketing, do not add a host booking endpoint. For Platform/SDK,
the host owns checkout and books from its backend. Publishing a hosted page,
listing an event on a Website, and opening sales are separate explicit actions.

A `SeatPicker` with `checkout: 'hosted'` takes the payment through SeatLayer
checkout. When the event cannot take it there (no hosted checkout, or no
gateway assigned), the picker falls back to the `onCheckout` handoff for that
buyer and reports why through `onCheckoutUnavailable`; a host that keeps that
fallback still needs its trusted booking route. An event created with a secret
key is Platform inventory unless the create sends `buyerCheckout: "seatlayer"`
or `bookingMode: "free"`, and the checkout owner is fixed once chosen.

## Buyer integration

| Host need | Surface | Live documentation |
|---|---|---|
| Complete selection and checkout handoff | `SeatPicker` | `https://docs.seatlayer.io/buyer-sdk/seat-picker/index.md` |
| Custom cart and selection controls | `SeatingChart` | `https://docs.seatlayer.io/buyer-sdk/seating-chart/index.md` |
| JavaScript, React, Vue or Angular | Web SDKs | `https://docs.seatlayer.io/buyer-sdk/web/index.md` |
| Package selection and installation | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/install/index.md` |
| Holds and checkout | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/index.md` |
| Hold expiry recovery | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/hold-expiry/index.md` |
| Best adjacent inventory | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/best-available/index.md` |
| Per-seat price choices | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/ticket-tiers/index.md` |
| Compare the native app SDKs | Mobile SDKs | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |
| 3D buyer view and seat views | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/3d-view/index.md` |
| Add 3D to an existing website, step by step | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/add-3d-seat-view/index.md` |
| Buyer picks a Season or a run of performances | `SeasonPicker` (JavaScript, React, Vue, Angular) or `PerformanceGroupPicker` (JavaScript) | `https://docs.seatlayer.io/buyer-sdk/seasons/index.md`, `https://docs.seatlayer.io/buyer-sdk/performance-groups/index.md` |
| Journey analytics | Buyer SDK callbacks | `https://docs.seatlayer.io/buyer-sdk/analytics/index.md` |

3D is offered for venues up to 60,000 seats. `max3DSeats` sets the limit (by default
60,000 on desktop and 30,000 on small or low-core devices) on the JavaScript `SeatPicker`, `SeatingChart`, `SeasonPicker` and
`PerformanceGroupPicker`, the React `SeatPicker` and `SeasonPicker`, and every mobile picker.
The React `SeatingChart` accepts `max3DSeats` in its type but ignores it at 0.112.0, and the
Vue and Angular `SeatingChart` components and Season pickers do not take it.

`SeatPicker` holds the buyer's seats when they go to checkout (or when the host
calls `holdSelection()`), then passes the `holdId` to `onCheckout`. With
`SeatingChart`, the host's own code calls `hold()`. `SeatPicker`,
`SeasonPicker` and `PerformanceGroupPicker` each take
`checkout: 'handoff' | 'hosted'`. Vue and Angular wrap `SeatingChart` and
`SeasonPicker` as components and re-export the complete picker as
`SeatPickerWidget`; `SeatManager` is under each package's `/manager` entry.

## Mobile SDK selection

| Host need | Package | Live documentation |
|---|---|---|
| Expo or React Native | `@seatlayer/react-native` (npm) | `https://docs.seatlayer.io/buyer-sdk/react-native/index.md` |
| Flutter | `seatlayer` (pub.dev) | `https://docs.seatlayer.io/buyer-sdk/flutter/index.md` |
| Native iOS | `SeatLayer` library from the `seatlayer-ios` Swift package | `https://docs.seatlayer.io/buyer-sdk/ios/index.md` |
| Native Android | `io.seatlayer:seatlayer-android` and `io.seatlayer:seatlayer-android-compose` (Maven Central) | `https://docs.seatlayer.io/buyer-sdk/android/index.md` |

Each native SDK has its own version. Read the current one from the registry or
`https://docs.seatlayer.io/sdk-catalog.json`; do not copy a version from this
file. A native picker takes one published Event. Season tickets and
Performance Groups are sold with the web SDK and the server SDKs, not in any
mobile SDK.

## Server and checkout

| Need | Live documentation |
|---|---|
| Complete browser/server example | `https://docs.seatlayer.io/examples/complete-checkout/index.md` |
| Server-side holds | `https://docs.seatlayer.io/server-api/holds/index.md` |
| Book a hold | `https://docs.seatlayer.io/server-api/booking/index.md` |
| Idempotency and conflicts | `https://docs.seatlayer.io/server-api/idempotency-and-conflicts/index.md` |
| Error body and every error code | `https://docs.seatlayer.io/server-api/errors/index.md` |
| Retries, `429` and `Retry-After` | `https://docs.seatlayer.io/server-api/rate-limits/index.md` |
| Event lifecycle | `https://docs.seatlayer.io/server-api/events/index.md` |
| Inventory control and resale (`put-up-for-resale`, `remove-from-resale`) | `https://docs.seatlayer.io/server-api/inventory/index.md` |
| Event hosting region | `https://docs.seatlayer.io/server-api/event-regions/index.md` |
| Fixed Renewable Seasons, including Season Best Available | `https://docs.seatlayer.io/server-api/seasons/index.md` |
| A season end to end: checkout choice, renewals, and the year from the host server | `https://docs.seatlayer.io/integrations/seasons/index.md` |
| Season holders and their customers, seats and tickets | `https://docs.seatlayer.io/server-api/holders/index.md` |
| Performance Groups (runs of two to twelve dates) | `https://docs.seatlayer.io/server-api/performance-groups/index.md` |
| Event and single-seat prices from the host server | `https://docs.seatlayer.io/server-api/prices/index.md` |
| Several dates from one floor plan or one set-up event | `https://docs.seatlayer.io/server-api/event-series/index.md` |
| Blocking and release | `https://docs.seatlayer.io/server-api/blocking/index.md` |
| Cancellations and box office | `https://docs.seatlayer.io/server-api/cancellations-and-box-office/index.md` |
| Reports and audit history | `https://docs.seatlayer.io/server-api/reports/index.md` |

Prefer the official server SDK for the host language, then use raw HTTP only
for an operation the current SDK does not expose. All seven server SDKs cover
the season operations.

| Need | Live documentation |
|---|---|
| Node, Python, PHP, Java, Go, Ruby, or .NET package | `https://docs.seatlayer.io/server-sdk/install/index.md` |
| Retries, idempotency, pagination, and typed errors | `https://docs.seatlayer.io/server-sdk/reliability/index.md` |
| SDK webhook verification | `https://docs.seatlayer.io/server-sdk/webhooks/index.md` |

## Private and channel access

| Need | Live documentation |
|---|---|
| Choose an allocation and sale route | `https://docs.seatlayer.io/platform/sales-channels/index.md` |
| End-to-end private or partner sale | `https://docs.seatlayer.io/integrations/private-and-partner-sales/index.md` |
| Mint, refresh, list, or revoke browser access | `https://docs.seatlayer.io/server-api/buyer-access-sessions/index.md` |
| Allocate, preview, or create hosted access links | `https://docs.seatlayer.io/server-api/channels/index.md` |

Use a hosted access link for a shareable capability URL. Use a buyer access
session when the host backend authenticates and authorizes each buyer. Never
accept channel scope from browser input; scope comes from the credential.

## Platforms and embedded operations

| Host need | Surface | Live documentation |
|---|---|---|
| Multi-tenant product | Workspaces | `https://docs.seatlayer.io/platform/workspaces/index.md` |
| Organizer chart editor | Embedded Designer | `https://docs.seatlayer.io/platform/embedded-designer/index.md` |
| Operator event board | Embedded control room | `https://docs.seatlayer.io/platform/embedded-control-room/index.md` |
| Lower-level operator UI, including hover prices through `categoryPrices` | SeatManager/ManageApi | `https://docs.seatlayer.io/platform/seat-manager/index.md` |
| Host-owned prices and offers | Pricing | `https://docs.seatlayer.io/platform/ticket-pricing-and-offers/index.md` |
| Short-lived browser credentials | Embed sessions | `https://docs.seatlayer.io/platform/embed-sessions/index.md` |
| Platform architecture | Platform guide | `https://docs.seatlayer.io/integrations/platforms/index.md` |

## Webhooks and customization

| Need | Live documentation |
|---|---|
| Production practices | `https://docs.seatlayer.io/integrations/best-practices/index.md` |
| Webhook subscriptions | `https://docs.seatlayer.io/webhooks/manage-subscriptions/index.md` |
| Event catalog (every public event name) | `https://docs.seatlayer.io/webhooks/events/index.md` |
| Signature verification | `https://docs.seatlayer.io/webhooks/signatures/index.md` |
| Delivery and retries | `https://docs.seatlayer.io/webhooks/delivery-and-retries/index.md` |
| Buyer branding | `https://docs.seatlayer.io/customization/buyer-experience/index.md` |
| Localization | `https://docs.seatlayer.io/customization/localization/index.md` |
| Currency and pricing | `https://docs.seatlayer.io/customization/currency-and-pricing/index.md` |

## Agent workflows

| Need | Live documentation |
|---|---|
| Agent implementation workflow | `https://docs.seatlayer.io/agents/integrate-seatlayer/index.md` |
| Agent context and prompt | `https://docs.seatlayer.io/agents/overview/index.md` |
| SeatLayer MCP: charts and events | `https://docs.seatlayer.io/agents/designer-mcp/index.md` |
| Connect Claude, Codex or ChatGPT to the SeatLayer MCP | `https://docs.seatlayer.io/agents/connect-claude/index.md`, `https://docs.seatlayer.io/agents/connect-codex/index.md`, `https://docs.seatlayer.io/agents/connect-chatgpt/index.md` |
| A first chart from a description, with or without a connection | `https://docs.seatlayer.io/start/first-chart-with-ai/index.md` |
| What each agent surface can do | `https://docs.seatlayer.io/agents/capabilities/index.md` |
| Turn a floor plan image or PDF into a chart (Click the plan) | `https://docs.seatlayer.io/designer/reference-plan-import/index.md` |
