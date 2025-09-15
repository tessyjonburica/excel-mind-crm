# ExcelMind CRM - Seeding Guide

## Purpose
Populate the database with default users, courses, enrollments, assignments, and notifications for local development and demos.

## How to Seed

Using Docker compose (backend service running):
```bash
docker-compose exec backend npm run seed
```

Local (Node):
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

## What Gets Created
- Users
  - Admin: admin@excelmind.edu / password123
  - Lecturer: lecturer@excelmind.edu / password123
  - Student: student@excelmind.edu / password123
  - Plus additional sample lecturer/student accounts
- Courses: CS101, MATH301, PHYS201 (with lecturers assigned)
- Enrollments: some approved, one pending
- Assignments: sample assignments per course
- Submissions: a few graded submissions
- Notifications: enrollment/grade notifications for students

## Notes
- Re-running the seed is idempotent for users/courses via upsert, but submissions/assignments are created each run in this version—reset DB if needed.
- Update seed data in `backend/prisma/seed.ts` for custom demos.


