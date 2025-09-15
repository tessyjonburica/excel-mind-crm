import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send WebSocket notification
    await this.sendWebSocketNotification(
      createNotificationDto.userId,
      'notification',
      notification,
    );

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async sendWebSocketNotification(userId: string, event: string, data: any) {
    this.notificationsGateway.sendToUser(userId, event, data);
  }

  async sendGradeUpdatedNotification(studentId: string, assignmentData: any) {
    await this.create({
      userId: studentId,
      title: 'Assignment Graded',
      message: `Your assignment "${assignmentData.title}" has been graded. You received ${assignmentData.grade}/${assignmentData.maxPoints} points.`,
      type: 'grade',
    });

    await this.sendWebSocketNotification(
      studentId,
      'gradeUpdated',
      assignmentData,
    );
  }

  async sendEnrollmentStatusNotification(studentId: string, enrollmentData: any) {
    const status = enrollmentData.status;
    const course = enrollmentData.course;

    await this.create({
      userId: studentId,
      title: `Enrollment ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your enrollment in ${course.title} has been ${status}.`,
      type: 'enrollment',
    });

    await this.sendWebSocketNotification(
      studentId,
      'enrollmentStatus',
      enrollmentData,
    );
  }
}
