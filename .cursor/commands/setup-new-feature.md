# Setup New Feature

## Purpose
- Prepare a clean workspace for building a new feature end-to-end.
- Align on scope, success metrics, and technical approach before coding.

## Use This When
- Starting a net-new feature or substantial enhancement.
- Kicking off a spike that may graduate into full delivery.

## Pre-Flight
- Feature brief or ticket is groomed with acceptance criteria.
- Dependencies (design mocks, backend APIs) are confirmed or scheduled.
- Align with product/design to confirm launch target and rollout plan.

## Steps
1. **Clarify scope**
   - Review requirements with stakeholders; capture open questions.
   - Define done criteria, telemetry needs, and rollout strategy.
2. **Plan architecture**
   - Identify components to reuse from `client/src/components/`.
   - Outline data flow between client, server, and shared schemas.
   - Document risks or assumptions in the feature ticket.
3. **Create branch**
   - `git checkout main`
   - `git pull origin main`
   - `git checkout -b feature/<short-description>`
4. **Set up task list**
   - Break work into commits or sub-tasks (UI, API, tests, cleanup).
   - Note cross-functional dependencies (QA, marketing, analytics).
5. **Bootstrap code**
   - Add routes/pages in `client/src/pages/` if needed.
   - Create or extend reusable components; follow functional and hooks-based patterns.
   - Update server handlers (`server/routes.ts`) for new endpoints.
6. **Instrumentation & testing**
   - Identify metrics or logging required to measure success.
   - Draft test plan covering unit, integration, and manual scenarios.
7. **Sync regularly**
   - Share progress in standup or async updates.
   - Adjust scope if blockers emerge; escalate early.

## Tips
- Keep branches small; prefer stacked PRs for lengthy features.
- Use feature flags or env toggles for staged rollout.
- Share WIP demos early to gather feedback and avoid rework.

