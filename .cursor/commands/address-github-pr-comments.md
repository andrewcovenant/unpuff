# Address GitHub PR Comments

## Purpose
- Quickly implement reviewer feedback while keeping context synced between Cursor, the terminal, and GitHub.
- Provide clear responses so reviewers can re-approve without extra back-and-forth.

## Use This When
- New review comments landed on an open pull request.
- A reviewer requested follow-up changes or clarifications.
- The PR is blocked until feedback is addressed.

## Pre-Flight
- `git status` is clean or only contains intentional work-in-progress.
- Latest `main` (or target base) is fetched: `git fetch origin`.
- You have comment permalinks handy (Cursor supports pasting them to load code context).

## Steps
1. **Sync the branch**
   - `git checkout <feature-branch>`
   - `git pull --rebase origin <feature-branch>`
   - Resolve any rebase conflicts before moving forward.
2. **Load each comment in Cursor**
   - Paste the GitHub comment link into Cursor to jump to the affected code.
   - Use Cursor search to surface the relevant file if the link is missing context.
3. **Plan the fixes**
   - Summarize the required change in plain language.
   - Confirm acceptance criteria with existing tests or add new ones if needed.
4. **Implement updates**
   - Apply edits using project-preferred components and functional patterns.
   - When multiple comments touch the same area, batch them to minimize churn.
5. **Run validations**
   - `npm run check` for TypeScript and lint coverage.
   - Execute targeted tests for impacted areas (or `npm test -- <pattern>`).
   - For UI changes, run Storybook or manual smoke tests if applicable.
6. **Document resolutions**
   - For each comment: reply on GitHub summarizing the change (include test coverage where relevant).
   - If you disagree with feedback, provide a respectful rationale and propose an alternative.
7. **Push updates**
   - `git status` → confirm only intentional files changed.
   - `git commit --amend` (if review is ongoing) or new commit per reviewer preference.
   - `git push origin <feature-branch>` (add `--force-with-lease` when amending).
8. **Update the PR**
   - Comment with a concise change summary and validation notes.
   - Re-request reviews if GitHub did not do so automatically.

## Tips
- When comment threads cover multiple files, keep a running checklist to avoid misses.
- If a fix is non-trivial, add inline code comments explaining the approach.
- Prefer resolving conversations only after confirming the reviewer’s original concern is fully addressed.
- Log unexpected regressions in the PR description to alert reviewers.

