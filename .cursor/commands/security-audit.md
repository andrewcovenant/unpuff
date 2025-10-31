# Security Audit

## Purpose
- Evaluate the codebase for security risks before major releases or architecture changes.
- Document findings and mitigation steps for the team.

## Use This When
- Performing quarterly or pre-launch security reviews.
- Significant auth, payment, or data-storage changes shipped.
- Responding to a reported vulnerability.

## Scope & Inputs
- Review server routes (`server/`), auth flows, and data persistence.
- Examine client-side storage, API calls, and sensitive UI flows.
- Check third-party dependencies and configuration.

## Steps
1. **Threat modeling**
   - Identify critical assets: user data, tokens, payment info.
   - Enumerate potential adversaries and attack surfaces.
2. **Dependency audit**
   - `npm audit --production`
   - Review `package.json` for deprecated or unmaintained libs.
   - Log CVEs and determine upgrade paths or justifications.
3. **Code review sweep**
   - Validate input sanitization and output encoding.
   - Confirm authentication/authorization checks guard sensitive endpoints.
   - Ensure secrets are not exposed in client bundles or logs.
4. **Configuration review**
   - Inspect `.env` handling, default credentials, and permissions.
   - Confirm SSL/TLS requirements for production endpoints.
5. **Data handling**
   - Verify minimal data retention and proper encryption at rest/in transit.
   - Confirm GDPR/CCPA compliance where relevant.
6. **Testing & verification**
   - Run automated security tests if available (Snyk, OWASP ZAP, etc.).
   - Perform manual checks for rate limiting, brute force prevention, CSRF, XSS.
7. **Reporting**
   - Summarize findings by severity (Critical/High/Medium/Low).
   - Propose remediation steps with owners and timelines.
   - Update security log or internal wiki.

## Tips
- Involve multiple disciplines (backend, frontend, ops) for broader coverage.
- Track waivers for known issues with clear expiry dates.
- Share learnings in a post-audit retro to improve developer awareness.

