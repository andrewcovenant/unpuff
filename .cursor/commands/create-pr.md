# Create PR

## Purpose
- Open a high-signal GitHub pull request with all required context and validation.
- Ensure collaborators can review efficiently without chasing missing information.

## Use This When
- Local changes are ready for feedback or merge.
- Work is scoped to a single feature, fix, or refactor.

## Pre-Flight
- `git status` shows only intentional changes.
- Tests and linters pass: `npm run check`, targeted `npm test`, platform-specific smoke tests.
- Commits are clean, logical, and free of unrelated changes.

## Steps
1. **Finalize commits**
   - `git add -p` to stage relevant hunks.
   - `git commit` with a clear summary (Conventional Commit style encouraged).
   - `git rebase -i origin/main` to squash or reorder commits when helpful.
2. **Sync with main**
   - `git fetch origin`
   - `git rebase origin/main` (or merge if repo prefers).
   - Re-run tests after rebasing.
3. **Push the branch**
   - `git push origin <feature-branch>` (use `--set-upstream` on first push).
4. **Open the PR**
   - Use GitHub UI or CLI: `gh pr create --fill --web` (optional).
   - Fill in template sections: summary, motivation, testing, screenshots, rollout.
   - Link related issues using `Fixes #123` syntax when applicable.
5. **Add reviewers + labels**
   - Assign code owners or domain experts.
   - Apply labels for release trains, risk levels, or workstream tags.
6. **Post-review readiness**
   - Request CI re-run if needed.
   - Drop a note in team channels summarizing the change when urgency or visibility demands it.

## PR Description Template

```
## Summary
- What changed & why

## Testing
- [ ] npm run check
- [ ] npm test
- [ ] Manual smoke (describe)

## Screenshots / Recordings
- Optional: add before/after visuals

## Rollout / Risks
- Potential failure modes and mitigations
```

## Tips
- Keep PRs under ~400 lines whenever possible; split large efforts into stacked PRs.
- Avoid force-push after receiving reviews unless coordinated (use `--force-with-lease`).
- Update the description when scope changes mid-review.

