# Light Review Existing Diffs

## Purpose
- Perform a quick health check on outstanding diffs without deep rework.
- Surface obvious issues before a full review cycle begins.

## Use This When
- You need a rapid status update on team branches.
- The goal is triage rather than exhaustive feedback.
- You are filling in while a primary reviewer is unavailable.

## Scope
- Focus on high-level red flags: failing tests, missing context, merge conflicts.
- Capture follow-up tasks rather than fixing everything inline.

## Steps
1. **Gather targets**
   - Use `gh pr list --author <teammate>` or GitHub filters to find active PRs.
   - Prioritize by urgency (blocking releases, critical fixes).
2. **Review metadata**
   - Confirm description completeness, linked issues, testing checklist.
   - Check CI status; note flaky or failing jobs.
3. **High-level diff scan**
   - Skim file list for risky areas (auth, payments, migrations).
   - Spot check key files for consistency with project patterns.
4. **Leave lightweight feedback**
   - Comment on blockers: failing tests, missing validation, broken build.
   - Ask clarifying questions when rationale is unclear.
   - Assign follow-up owners if action is needed.
5. **Summarize findings**
   - Drop a short review summary (e.g., “Light pass: looks good overall, see two questions about error handling”).
   - Update team tracker or standup notes if the PR impacts milestones.

## Tips
- Keep feedback concise—defer deep dives to the designated reviewer.
- Flag large PRs for splitting early to avoid review fatigue.
- Encourage authors to self-review and check boxes for tests/screenshots.

