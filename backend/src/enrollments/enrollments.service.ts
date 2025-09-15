import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async requestEnrollment(courseId: string, studentId: string) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if enrollment already exists
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('You have already requested enrollment in this course');
    }

    // Create enrollment request
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'pending',
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            lecturer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Notify lecturer about enrollment request
    await this.notificationsService.create({
      userId: course.lecturerId,
      title: 'New Enrollment Request',
      message: `${enrollment.student.name} has requested to enroll in ${enrollment.course.title}`,
      type: 'enrollment',
    });

    return enrollment;
  }

  async approveEnrollment(enrollmentId: string, adminId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== 'pending') {
      throw new ConflictException('Enrollment is not pending');
    }

    // Update enrollment status
    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'approved',
        approvedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    // Notify student about approval
    await this.notificationsService.create({
      userId: enrollment.studentId,
      title: 'Enrollment Approved',
      message: `Your enrollment in ${enrollment.course.title} has been approved`,
      type: 'enrollment',
    });

    // Send WebSocket notification
    await this.notificationsService.sendWebSocketNotification(
      enrollment.studentId,
      'enrollmentStatus',
      {
        enrollmentId: updatedEnrollment.id,
        status: 'approved',
        course: updatedEnrollment.course,
      },
    );

    return updatedEnrollment;
  }

  async rejectEnrollment(enrollmentId: string, adminId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== 'pending') {
      throw new ConflictException('Enrollment is not pending');
    }

    // Update enrollment status
    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'rejected',
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    // Notify student about rejection
    await this.notificationsService.create({
      userId: enrollment.studentId,
      title: 'Enrollment Rejected',
      message: `Your enrollment in ${enrollment.course.title} has been rejected`,
      type: 'enrollment',
    });

    // Send WebSocket notification
    await this.notificationsService.sendWebSocketNotification(
      enrollment.studentId,
      'enrollmentStatus',
      {
        enrollmentId: updatedEnrollment.id,
        status: 'rejected',
        course: updatedEnrollment.course,
      },
    );

    return updatedEnrollment;
  }

  async getPendingEnrollments() {
    return this.prisma.enrollment.findMany({
      where: { status: 'pending' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            lecturer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            lecturer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
