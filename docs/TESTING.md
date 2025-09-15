# ExcelMind CRM - Testing Strategy

## Goals

- Unit tests for core services/helpers (≥70% coverage target)
- Integration/E2E tests for critical user flows
- Deterministic AI behavior in tests (use `MOCK_AI=true`)
- Include WebSocket event verification

## Backend (NestJS)

### Unit Tests
- Focus: services (auth, courses, enrollments, assignments, transcript, notifications)
- Tools: Jest, ts-jest
- Coverage goal: ≥70%

Run:
```bash
cd backend
npm run test
```

### Integration / E2E Tests (Supertest)
- Flows to cover:
  - Auth: register → login → /users/me
  - Enroll: student request → admin approve → student sees status
  - Assignments: student submit → lecturer grade → student notified
  - Transcript: GET /transcript/:studentId/pdf returns valid PDF

Run:
```bash
cd backend
npm run test:e2e
```

Test DB:
- Use a separate database or Docker compose for test (`docker-compose.test.yml`).
- Run migrations and optional seed before E2E tests.

## Frontend (Next.js)

### Unit/Component Tests (RTL + Jest)
- Focus: form validation, guards, providers, simple UI logic

Run:
```bash
cd frontend
npm run test
```

### Playwright E2E
- Flows to cover:
  - Login/Register navigations
  - Role dashboards rendering
  - Course list/detail basic smoke
  - Transcript download (assert response headers + non-empty body if hitting live API)
  - Real-time notification toast when grading happens (use mock route or staged backend)

Run:
```bash
cd frontend
npm run test:e2e
```

Tips:
- Mock backend responses for deterministic UI tests; use `page.route`.
- For full-stack E2E, run backend locally with test DB and `MOCK_AI=true`.

## WebSocket Testing Example (Backend)

Pseudocode (Jest):
```ts
import { io } from 'socket.io-client'

test('gradeUpdated event delivered to student', (done) => {
  const token = getJwtForStudent()
  const socket = io('http://localhost:3001', { auth: { token } })
  socket.on('connect', async () => {
    // Trigger grading in backend (HTTP call)
    await gradeSubmissionAsLecturer()
  })
  socket.on('gradeUpdated', (payload) => {
    expect(payload).toMatchObject({ grade: expect.any(Number) })
    socket.close()
    done()
  })
})
```

## CI Recommendations
- GitHub Actions: install deps, lint, run backend tests, run frontend tests, optionally spin Postgres service for E2E.
- Upload coverage reports as artifacts.


