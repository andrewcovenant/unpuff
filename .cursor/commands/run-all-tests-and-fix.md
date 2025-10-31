# Run All Tests and Fix

## Purpose
- Execute the full automated test suite and resolve any failures before merging.
- Maintain a green main branch and high confidence in releases.

## Use This When
- Preparing to merge a large change set.
- CI is red and you need to reproduce locally.
- Performing a pre-release hardening sweep.

## Pre-Flight
- Ensure dependencies are installed: `npm install`.
- Sync environment variables if tests rely on them (see `.env.example`).
- Stop any background processes that might conflict with ports/databases.

## Steps
1. **Static checks**
   - `npm run check` → TypeScript + lint.
   - Fix violations using recommended project patterns.
2. **Unit & integration tests**
   - `npm test` (or `npm test -- --watch=false` for single run).
   - For targeted fixes: `npm test -- <pattern>`.
3. **End-to-end / platform tests (if configured)**
   - iOS: `npx cap sync ios && npx cap open ios` for simulator smoke tests.
   - Android: `npx cap sync android && npx cap open android`.
4. **Address failures**
   - Read stack traces carefully; reproduce with focused commands.
   - When tests are flaky, document it and open a follow-up issue.
   - Keep fixes scoped; avoid rewriting unrelated code.
5. **Re-run until green**
   - Repeat steps above until `npm test` and `npm run check` exit cleanly.
   - Capture command output for the PR description or reviewer notes.
6. **Document changes**
   - Update fixtures, mocks, or docs when behavior changes.
   - Note borrowed techniques or new utilities in commit messages.

## Tips
- Use `git bisect` for regressions introduced by recent commits.
- For slow suites, leverage `npm test -- --runInBand` vs. parallel runs to isolate race conditions.
- Commit frequently with descriptive messages to ease rollback if needed.

