# Backend E2E Tests

This directory contains end-to-end tests for the ExcelMind CRM backend API using Jest and Supertest.

## Test Structure

```
backend-e2e/
├── auth.e2e-spec.ts          # Authentication tests
├── courses.e2e-spec.ts       # Course management tests
├── assignments.e2e-spec.ts   # Assignment system tests
├── enrollments.e2e-spec.ts   # Enrollment workflow tests
├── ai.e2e-spec.ts           # AI features tests
├── transcript.e2e-spec.ts    # Transcript generation tests
├── websocket.e2e-spec.ts     # WebSocket notification tests
├── setup.ts                  # Test setup and configuration
└── README.md                 # This file
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- auth.e2e-spec.ts

# Run tests with coverage
npm run test:e2e:cov

# Run tests in watch mode
npm run test:e2e:watch
```

## Test Data

Tests use a separate test database and are isolated from each other. Each test suite:
- Sets up required test data
- Runs the test scenarios
- Cleans up after completion

## Environment

Tests run against a test database instance and use mock external services where appropriate.
