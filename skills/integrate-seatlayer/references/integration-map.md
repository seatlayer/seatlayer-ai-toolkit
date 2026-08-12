# Integration map

Select the smallest surface that satisfies the host product. Load only the
listed live Markdown pages plus any exact reference page discovered through
`llms.txt`.

## Foundations

| Need | Live documentation |
|---|---|
| Product model | `https://docs.seatlayer.io/start/overview/index.md` |
| Integration selection | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| First complete loop | `https://docs.seatlayer.io/start/quickstart/index.md` |
| Authentication and environments | `https://docs.seatlayer.io/start/authentication/index.md` |
| Production launch | `https://docs.seatlayer.io/start/going-live/index.md` |

## Commerce and distribution

| Host outcome | Product/surface | Live documentation |
|---|---|---|
| SeatLayer owns checkout, Orders, tickets, refunds, and Door | Managed ticketing | `https://docs.seatlayer.io/start/first-event/index.md` |
| Share one complete buyer destination | Hosted Event Page | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| Put managed checkout in an existing site | Managed embed | `https://docs.seatlayer.io/integrations/iframe/index.md` |
| Publish an organizer site | Organizer Website | `https://docs.seatlayer.io/start/choose-an-integration/index.md` |
| Host owns commerce and fulfilment | Platform/SDK | `https://docs.seatlayer.io/integrations/platforms/index.md` |
| Private, partner, sponsor, or presale inventory | Sales channel | `https://docs.seatlayer.io/integrations/private-and-partner-sales/index.md` |

For managed ticketing, do not add a host booking endpoint. For Platform/SDK,
the host owns checkout and books from its backend. Publishing a hosted page,
listing an event on a Website, and opening sales are separate explicit actions.

## Buyer integration

| Host need | Surface | Live documentation |
|---|---|---|
| Complete selection and checkout handoff | `SeatPicker` | `https://docs.seatlayer.io/buyer-sdk/seat-picker/index.md` |
| Custom cart and selection controls | `SeatingChart` | `https://docs.seatlayer.io/buyer-sdk/seating-chart/index.md` |
| Package selection and installation | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/install/index.md` |
| Holds and checkout | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/index.md` |
| Hold expiry recovery | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/hold-expiry/index.md` |
| Best adjacent inventory | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/best-available/index.md` |
| Per-seat price choices | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/ticket-tiers/index.md` |
| Mobile applications | Webview/release status | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |
| 3D buyer view | Buyer SDK | `https://docs.seatlayer.io/buyer-sdk/3d-view/index.md` |
| Journey analytics | Buyer SDK callbacks | `https://docs.seatlayer.io/buyer-sdk/analytics/index.md` |

## Mobile SDK selection

| Host need | Package | Live documentation |
|---|---|---|
| Expo or React Native | `@seatlayer/react-native` | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |
| Flutter | `seatlayer` | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |
| Native iOS | Swift package | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |
| Native Android | Kotlin/JitPack package | `https://docs.seatlayer.io/buyer-sdk/mobile/index.md` |

## Server and checkout

| Need | Live documentation |
|---|---|
| Complete browser/server example | `https://docs.seatlayer.io/examples/complete-checkout/index.md` |
| Book a hold | `https://docs.seatlayer.io/server-api/booking/index.md` |
| Idempotency and conflicts | `https://docs.seatlayer.io/server-api/idempotency-and-conflicts/index.md` |
| Event lifecycle | `https://docs.seatlayer.io/server-api/events/index.md` |
| Inventory control | `https://docs.seatlayer.io/server-api/inventory/index.md` |
| Blocking and release | `https://docs.seatlayer.io/server-api/blocking/index.md` |
| Cancellations and box office | `https://docs.seatlayer.io/server-api/cancellations-and-box-office/index.md` |
| Reports and audit history | `https://docs.seatlayer.io/server-api/reports/index.md` |

Prefer the official server SDK for the host language, then use raw HTTP only
for an operation the current SDK does not expose.

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
| Lower-level operator UI | SeatManager/ManageApi | `https://docs.seatlayer.io/platform/seat-manager/index.md` |
| Short-lived browser credentials | Embed sessions | `https://docs.seatlayer.io/platform/embed-sessions/index.md` |
| Platform architecture | Platform guide | `https://docs.seatlayer.io/integrations/platforms/index.md` |

## Webhooks and customization

| Need | Live documentation |
|---|---|
| Production practices | `https://docs.seatlayer.io/integrations/best-practices/index.md` |
| Webhook subscriptions | `https://docs.seatlayer.io/webhooks/manage-subscriptions/index.md` |
| Event catalog | `https://docs.seatlayer.io/webhooks/events/index.md` |
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
| Chart-authoring agent | `https://docs.seatlayer.io/agents/designer-mcp/index.md` |
