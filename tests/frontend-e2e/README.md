# Frontend E2E Tests

This directory contains end-to-end tests for the ExcelMind CRM frontend using Playwright and React Testing Library.

## Test Structure

```
frontend-e2e/
├── auth.spec.ts              # Authentication flow tests
├── dashboard.spec.ts         # Dashboard functionality tests
├── courses.spec.ts           # Course management tests
├── assignments.spec.ts       # Assignment system tests
├── ai-assistant.spec.ts      # AI assistant tests
├── transcript.spec.ts        # Transcript download tests
├── notifications.spec.ts     # Real-time notification tests
├── setup.ts                  # Test setup and configuration
└── README.md                 # This file
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- auth.spec.ts

# Run tests in headed mode
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Generate test report
npm run test:e2e:report
```

## Test Scenarios

### Authentication Tests
- User registration flow
- User login flow
- Role-based access control
- Logout functionality

### Dashboard Tests
- Student dashboard display
- Lecturer dashboard display
- Admin dashboard display
- Navigation between sections

### Course Management Tests
- Course browsing
- Course enrollment requests
- Course detail views
- Syllabus downloads

### Assignment Tests
- Assignment submission
- Assignment grading (lecturer)
- Grade notifications
- File upload functionality

### AI Assistant Tests
- Course recommendations
- Syllabus generation
- Chat interface
- Mock AI responses

### Transcript Tests
- Transcript generation
- PDF download functionality
- Student data display

### Notification Tests
- Real-time notifications
- WebSocket connections
- Toast notifications
- Notification persistence

## Environment

Tests run against a test backend instance and use mock data where appropriate. The test environment is isolated from the development and production environments.
