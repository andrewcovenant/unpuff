# Tests

This directory contains all tests for the Unpuff application.

## Structure

```
tests/
├── e2e/              # End-to-end tests
│   ├── auth-flow.test.ts
│   └── README.md
└── screenshots/      # Test screenshots (auto-generated)
```

## E2E Tests

End-to-end tests use Puppeteer to test the full application flow in a real browser environment.

See [e2e/README.md](./e2e/README.md) for more details.

## Running Tests

```bash
# Run all e2e tests
npm run test:e2e

# Or use the shorthand
npm run test
```

## Requirements

- Dev server must be running on port 3000
- Puppeteer must be installed (included in devDependencies)
