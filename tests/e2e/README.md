# E2E Tests

This directory contains end-to-end tests for the Unpuff application.

## Tests

### `auth-flow.test.ts`

Tests the complete authentication and onboarding flow:

1. **Authentication Flow**

   - Navigates to the app
   - Signs up a new user
   - Verifies authentication success

2. **Onboarding Flow**

   - Completes the 3-screen onboarding process:
     - Screen 1: Welcome message
     - Screen 2: Trigger selection
     - Screen 3: Identity and daily baseline setup

3. **Main Screen Verification**
   - Verifies the main screen is displayed
   - Checks that localStorage data is saved correctly
   - Validates key UI elements are present

## Running Tests

Make sure your dev server is running on port 3000:

```bash
# In one terminal, start the dev server
npm run dev

# In another terminal, run the tests
npm run test:e2e
# or
npm run test
```

## Test Configuration

- **App URL**: `http://localhost:3000` (configurable via `APP_URL` constant)
- **Browser**: Puppeteer (Chrome/Chromium)
- **Viewport**: 375x812 (iPhone size)
- **Screenshots**: Saved to `tests/screenshots/` directory

## Screenshots

Screenshots are automatically captured at key points:

- After authentication
- After onboarding
- On test failures
- Main screen verification

Screenshots help debug test failures and verify the UI state at each step.

## Requirements

- Node.js 18+
- Dev server running on port 3000
- Puppeteer (installed as dev dependency)

## Notes

- Tests use unique usernames (timestamp-based) to avoid conflicts
- Tests clear localStorage before each run to ensure clean state
- Tests wait for network idle to ensure pages are fully loaded
- Browser runs in non-headless mode by default (change `headless: false` to `true` for CI)
