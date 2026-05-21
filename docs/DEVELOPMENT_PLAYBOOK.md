# Gear5 Development Playbook

## Product Baseline

Gear5 is currently a Vite + React prototype with four role surfaces:

- Rider mobile app: booking, ride package balance, QR pass, cancellation, and live ride view.
- Driver mobile app: assigned trips, trip detail, go online, active trip console, rider list, QR scanner mock, route map mock, delay, announce, SOS, and end-trip flow.
- Admin mobile app: daily operations, trips, driver assignment, timing change, passes, rider lookup, login conversion, and issues.
- Superadmin web app: master routes, schedules, trips, riders, passes, drivers, vehicles, bookings, issues, notifications, reports, admin users, and settings.

The app intentionally uses local mock data and Zustand persistence until backend contracts are finalized.

## Development Method

Build in vertical slices. A slice is only complete when it includes the UI, state or service contract, validation rules, empty/loading/error states, and a production build check.

Use the existing role routes as the product spec. Keep mock data shaped like future API responses so the backend connection is a replacement of services, not a rewrite of screens.

For visual UI refinements, use the local mockup handoff in `docs/UI_MOCKUP_WORKFLOW.md` instead of long prose descriptions. Drop marked-up screenshots into `mockups/inbox/`, update `mockups/REQUEST.md`, then have Codex translate the mockup into the React/CSS implementation.

## Phase 0: Stabilize Prototype

Goals:

- Keep `npm.cmd run build` passing.
- Align all demo dates and operational data around the same service date.
- Reduce heavy visual assets before they become a performance habit.
- Document current roles, scope, and development rules in this playbook.
- Preserve the current four-role navigation from `/`.

Exit criteria:

- Build succeeds.
- Rider, driver, admin, and superadmin entry points render.
- Demo data no longer mixes old service dates.
- Oversized static assets are replaced or compressed.

## Phase 1: Final Clickable Product Prototype

Goals:

- Rider flow is complete from route selection to booking confirmation, QR pass, cancellation, and live ride.
- Driver flow is complete from assigned trip to go-online, active trip, QR/manual boarding mock, delay/announcement, and trip completion.
- Admin flow covers daily operations: trips, driver replacement, timing changes, pass assignment, rider lookup, and issues.
- Superadmin flow covers master-data ownership: routes, schedules, users, fleet, reports, settings, and audit-oriented views.
- Screen states are realistic enough for stakeholder review before backend work begins.

Exit criteria:

- Every role can be demoed from the role switcher without explaining missing navigation.
- Critical business rules are visible in the interaction or mock data.
- The app builds and can be reviewed locally with `npm.cmd run dev`.

## Business Rules To Preserve

- Riders may book with zero passes; the balance may become negative.
- Pass assignment offsets negative balance first and creates a ledger entry.
- Booking and cancellation cutoffs are enforced by service rules.
- Admin mobile can change today's trip instance and replace drivers.
- Superadmin owns route masters, recurring schedules, permissions, settings, reports, and exports.
- Driver boarding supports QR scan first and manual override with audit trail later.

## Backend Contract Direction

Keep these domains separate when moving from mock data to APIs:

- Identity and roles.
- Riders and profile completion.
- Routes, stops, and schedules.
- Trip instances.
- Bookings and boarding events.
- Pass ledger.
- Drivers and vehicles.
- Issues, notifications, and audit logs.
- Reports and exports.

## Verification

Run before handoff:

```powershell
npm.cmd run build
```

Use local review for interactive flow checks:

```powershell
npm.cmd run dev
```
