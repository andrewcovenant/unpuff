# Code Review Checklist

## Purpose
- Provide a consistent review baseline that prioritizes safety, clarity, and product goals.
- Reduce churn by ensuring every PR receives the same quality bar.

## Use This When
- Reviewing any pull request, regardless of size.
- Performing a self-review before requesting feedback.

## Review Flow
1. **Understand the change**
   - Read the PR description, linked issues, and acceptance criteria.
   - Skim commits for structure (large PRs may require commit-by-commit review).
2. **Safety first**
   - Confirm tests exist for critical paths and edge cases.
   - Look for missing error handling or unhandled promise rejections.
   - Verify configuration, environment variables, and secrets are handled securely.
3. **Correctness & behavior**
   - Ensure user-facing flows match product requirements.
   - Compare new logic against existing patterns and data contracts.
   - Manually run impacted code paths when feasible.
4. **Code quality**
   - Check for adherence to React functional component patterns and hooks conventions.
   - Inspect naming, file organization, and reuse of existing project components.
   - Flag dead code, TODOs, or commented-out blocks that should be removed.
5. **Performance & scalability**
   - Watch for unnecessary renders, heavy computations in render paths, or large bundle impacts.
   - Confirm pagination, batching, or memoization where needed.
6. **Security & privacy**
   - Validate input sanitization, escaping, and permission checks.
   - Ensure secrets are not logged or stored client-side.
7. **Developer experience**
   - Confirm docs, READMEs, or changelog entries are updated when behavior changes.
   - Validate tooling scripts or CI instructions remain accurate.
8. **Approval criteria**
   - All blockers resolved and major conversations closed.
   - Tests pass locally and/or in CI.
   - PR remains focused (out-of-scope issues tracked separately).

## Review Notes Template
Use this structure when leaving review comments or summaries:

- **Summary**: High-level impression of the change.
- **Blockers**: Items that must be addressed before approval.
- **Suggestions**: Optional improvements or future tasks.
- **Validation**: Commands/tests you ran and results.

## Tips
- Batch similar comments to avoid noise.
- Prefer actionable language: describe the issue, impact, and suggested fix.
- Celebrate great decisions to reinforce positive patterns.

