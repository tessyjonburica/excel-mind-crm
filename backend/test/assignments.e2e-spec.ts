import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Assignments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let lecturerToken: string;
  let studentToken: string;
  let courseId: string;
  let assignmentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.notification.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    const lecturerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'lecturer@test.com',
        name: 'Test Lecturer',
        password: 'password123',
        role: 'lecturer',
      });
    lecturerToken = lecturerResponse.body.token;

    const studentResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'student@test.com',
        name: 'Test Student',
        password: 'password123',
        role: 'student',
      });
    studentToken = studentResponse.body.token;

    // Create test course
    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        title: 'Test Course',
        description: 'A test course description',
        code: 'TEST101',
        credits: 3,
      });
    courseId = courseResponse.body.id;

    // Enroll student in course
    await prisma.enrollment.create({
      data: {
        studentId: studentResponse.body.user.id,
        courseId: courseId,
        status: 'approved',
        enrolledAt: new Date(),
        approvedAt: new Date(),
      },
    });
  });

  describe('/assignments (POST)', () => {
    it('should create an assignment as lecturer', () => {
      return request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({
          title: 'Test Assignment',
          description: 'A test assignment description',
          courseId: courseId,
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Assignment');
          expect(res.body.maxPoints).toBe(100);
          assignmentId = res.body.id;
        });
    });

    it('should not create assignment as student', () => {
      return request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Test Assignment',
          description: 'A test assignment description',
          courseId: courseId,
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .expect(403);
    });
  });

  describe('/assignments/:id/submit (POST)', () => {
    beforeEach(async () => {
      // Create test assignment
      const response = await request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({
          title: 'Test Assignment',
          description: 'A test assignment description',
          courseId: courseId,
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      assignmentId = response.body.id;
    });

    it('should submit assignment as enrolled student', () => {
      return request(app.getHttpServer())
        .post(`/assignments/${assignmentId}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          content: 'This is my assignment submission',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.content).toBe('This is my assignment submission');
        });
    });

    it('should not submit assignment if not enrolled', async () => {
      // Create another student not enrolled in course
      const otherStudentResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'other@test.com',
          name: 'Other Student',
          password: 'password123',
          role: 'student',
        });

      return request(app.getHttpServer())
        .post(`/assignments/${assignmentId}/submit`)
        .set('Authorization', `Bearer ${otherStudentResponse.body.token}`)
        .send({
          content: 'This is my assignment submission',
        })
        .expect(403);
    });
  });
});
