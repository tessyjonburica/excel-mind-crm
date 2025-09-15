import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@excelmind.edu' },
    update: {},
    create: {
      email: 'admin@excelmind.edu',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'admin',
      avatar: '/placeholder-user.jpg',
    },
  });

  // Create Lecturer Users
  const lecturer1 = await prisma.user.upsert({
    where: { email: 'lecturer@excelmind.edu' },
    update: {},
    create: {
      email: 'lecturer@excelmind.edu',
      name: 'Dr. Sarah Johnson',
      password: hashedPassword,
      role: 'lecturer',
      avatar: '/placeholder-user.jpg',
    },
  });

  const lecturer2 = await prisma.user.upsert({
    where: { email: 'prof.smith@excelmind.edu' },
    update: {},
    create: {
      email: 'prof.smith@excelmind.edu',
      name: 'Prof. Michael Smith',
      password: hashedPassword,
      role: 'lecturer',
      avatar: '/placeholder-user.jpg',
    },
  });

  // Create Student Users
  const student1 = await prisma.user.upsert({
    where: { email: 'student@excelmind.edu' },
    update: {},
    create: {
      email: 'student@excelmind.edu',
      name: 'John Doe',
      password: hashedPassword,
      role: 'student',
      avatar: '/placeholder-user.jpg',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'jane.doe@excelmind.edu' },
    update: {},
    create: {
      email: 'jane.doe@excelmind.edu',
      name: 'Jane Doe',
      password: hashedPassword,
      role: 'student',
      avatar: '/placeholder-user.jpg',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'alice.smith@excelmind.edu' },
    update: {},
    create: {
      email: 'alice.smith@excelmind.edu',
      name: 'Alice Smith',
      password: hashedPassword,
      role: 'student',
      avatar: '/placeholder-user.jpg',
    },
  });

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      title: 'Introduction to Computer Science',
      description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
      code: 'CS101',
      credits: 3,
      lecturerId: lecturer1.id,
      syllabusUrl: '/uploads/syllabi/cs101-syllabus.pdf',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code: 'MATH301' },
    update: {},
    create: {
      title: 'Advanced Mathematics',
      description: 'Advanced mathematical concepts including calculus, linear algebra, and differential equations.',
      code: 'MATH301',
      credits: 4,
      lecturerId: lecturer2.id,
      syllabusUrl: '/uploads/syllabi/math301-syllabus.pdf',
    },
  });

  const course3 = await prisma.course.upsert({
    where: { code: 'PHYS201' },
    update: {},
    create: {
      title: 'Physics Laboratory',
      description: 'Hands-on physics experiments and laboratory techniques.',
      code: 'PHYS201',
      credits: 2,
      lecturerId: lecturer1.id,
      syllabusUrl: '/uploads/syllabi/phys201-syllabus.pdf',
    },
  });

  // Create Enrollments
  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student1.id,
        courseId: course1.id,
        status: 'approved',
        enrolledAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-16'),
      },
      {
        studentId: student1.id,
        courseId: course2.id,
        status: 'approved',
        enrolledAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-16'),
      },
      {
        studentId: student2.id,
        courseId: course1.id,
        status: 'approved',
        enrolledAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-16'),
      },
      {
        studentId: student2.id,
        courseId: course3.id,
        status: 'pending',
        enrolledAt: new Date('2024-01-20'),
      },
      {
        studentId: student3.id,
        courseId: course2.id,
        status: 'approved',
        enrolledAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-16'),
      },
    ],
    skipDuplicates: true,
  });

  // Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Programming Project 1',
      description: 'Create a simple calculator application using Python.',
      courseId: course1.id,
      maxPoints: 100,
      dueDate: new Date('2024-02-15'),
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Calculus Problem Set 1',
      description: 'Solve differential equations and integration problems.',
      courseId: course2.id,
      maxPoints: 100,
      dueDate: new Date('2024-02-20'),
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      title: 'Physics Lab Report 1',
      description: 'Write a detailed report on the pendulum experiment.',
      courseId: course3.id,
      maxPoints: 50,
      dueDate: new Date('2024-02-18'),
    },
  });

  // Create Submissions
  await prisma.submission.createMany({
    data: [
      {
        assignmentId: assignment1.id,
        studentId: student1.id,
        content: 'I have implemented a basic calculator with addition, subtraction, multiplication, and division operations.',
        fileUrl: '/uploads/submissions/student1-assignment1.py',
        grade: 85,
        feedback: 'Good implementation! Consider adding error handling for division by zero.',
        submittedAt: new Date('2024-02-14'),
        gradedAt: new Date('2024-02-16'),
      },
      {
        assignmentId: assignment1.id,
        studentId: student2.id,
        content: 'Calculator implementation with GUI using tkinter.',
        fileUrl: '/uploads/submissions/student2-assignment1.py',
        grade: 92,
        feedback: 'Excellent work! The GUI implementation is well done.',
        submittedAt: new Date('2024-02-13'),
        gradedAt: new Date('2024-02-15'),
      },
      {
        assignmentId: assignment2.id,
        studentId: student1.id,
        content: 'Solved all differential equations using separation of variables method.',
        fileUrl: '/uploads/submissions/student1-assignment2.pdf',
        grade: 78,
        feedback: 'Good approach, but some steps could be more detailed.',
        submittedAt: new Date('2024-02-19'),
        gradedAt: new Date('2024-02-21'),
      },
    ],
    skipDuplicates: true,
  });

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: 'Assignment Graded',
        message: 'Your Programming Project 1 has been graded. You received 85/100 points.',
        type: 'grade',
        read: false,
      },
      {
        userId: student2.id,
        title: 'Assignment Graded',
        message: 'Your Programming Project 1 has been graded. You received 92/100 points.',
        type: 'grade',
        read: false,
      },
      {
        userId: student2.id,
        title: 'Enrollment Pending',
        message: 'Your enrollment request for Physics Laboratory is pending approval.',
        type: 'enrollment',
        read: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Sample Credentials:');
  console.log('Admin: admin@excelmind.edu / password123');
  console.log('Lecturer: lecturer@excelmind.edu / password123');
  console.log('Student: student@excelmind.edu / password123');
  console.log('\n📊 Created:');
  console.log(`- 1 Admin user`);
  console.log(`- 2 Lecturer users`);
  console.log(`- 3 Student users`);
  console.log(`- 3 Courses`);
  console.log(`- 5 Enrollments`);
  console.log(`- 3 Assignments`);
  console.log(`- 3 Submissions`);
  console.log(`- 3 Notifications`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
