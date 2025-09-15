import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Courses (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let lecturerToken: string;
  let courseId: string;

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
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin@test.com',
        name: 'Test Admin',
        password: 'password123',
        role: 'admin',
      });
    authToken = adminResponse.body.token;

    const lecturerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'lecturer@test.com',
        name: 'Test Lecturer',
        password: 'password123',
        role: 'lecturer',
      });
    lecturerToken = lecturerResponse.body.token;
  });

  describe('/courses (POST)', () => {
    it('should create a course as lecturer', () => {
      return request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({
          title: 'Test Course',
          description: 'A test course description',
          code: 'TEST101',
          credits: 3,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Course');
          expect(res.body.code).toBe('TEST101');
          courseId = res.body.id;
        });
    });

    it('should not create course as student', () => {
      const studentResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'student@test.com',
          name: 'Test Student',
          password: 'password123',
          role: 'student',
        });

      return request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${studentResponse.body.token}`)
        .send({
          title: 'Test Course',
          description: 'A test course description',
          code: 'TEST101',
          credits: 3,
        })
        .expect(403);
    });
  });

  describe('/courses (GET)', () => {
    beforeEach(async () => {
      // Create a test course
      const response = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({
          title: 'Test Course',
          description: 'A test course description',
          code: 'TEST101',
          credits: 3,
        });
      courseId = response.body.id;
    });

    it('should get all courses', () => {
      return request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get course by id', () => {
      return request(app.getHttpServer())
        .get(`/courses/${courseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(courseId);
          expect(res.body.title).toBe('Test Course');
        });
    });
  });
});
