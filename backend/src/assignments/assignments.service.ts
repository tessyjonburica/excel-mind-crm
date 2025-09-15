import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto, lecturerId: string) {
    // Verify course exists and user is the lecturer
    const course = await this.prisma.course.findUnique({
      where: { id: createAssignmentDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.lecturerId !== lecturerId) {
      throw new ForbiddenException('You can only create assignments for your own courses');
    }

    return this.prisma.assignment.create({
      data: createAssignmentDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
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
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
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
        submissions: {
          include: {
            student: {
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

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto, lecturerId: string) {
    const assignment = await this.findOne(id);

    // Check if user is the lecturer of the course
    if (assignment.course.lecturer.id !== lecturerId) {
      throw new ForbiddenException('You can only update assignments for your own courses');
    }

    return this.prisma.assignment.update({
      where: { id },
      data: updateAssignmentDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });
  }

  async remove(id: string, lecturerId: string) {
    const assignment = await this.findOne(id);

    // Check if user is the lecturer of the course
    if (assignment.course.lecturer.id !== lecturerId) {
      throw new ForbiddenException('You can only delete assignments for your own courses');
    }

    return this.prisma.assignment.delete({
      where: { id },
    });
  }

  async submitAssignment(assignmentId: string, submitAssignmentDto: SubmitAssignmentDto, studentId: string) {
    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: assignment.courseId,
        },
      },
    });

    if (!enrollment || enrollment.status !== 'approved') {
      throw new ForbiddenException('You must be enrolled in this course to submit assignments');
    }

    // Check if submission already exists
    const existingSubmission = await this.prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
    });

    if (existingSubmission) {
      throw new ConflictException('You have already submitted this assignment');
    }

    // Create submission
    return this.prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        content: submitAssignmentDto.content,
        fileUrl: submitAssignmentDto.fileUrl,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async gradeAssignment(assignmentId: string, submissionId: string, gradeAssignmentDto: GradeAssignmentDto, lecturerId: string) {
    // Check if submission exists
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
        student: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if user is the lecturer of the course
    if (submission.assignment.course.lecturerId !== lecturerId) {
      throw new ForbiddenException('You can only grade assignments for your own courses');
    }

    // Update submission with grade
    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: gradeAssignmentDto.grade,
        feedback: gradeAssignmentDto.feedback,
        gradedAt: new Date(),
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for student
    await this.notificationsService.create({
      userId: submission.studentId,
      title: 'Assignment Graded',
      message: `Your assignment "${submission.assignment.title}" has been graded. You received ${gradeAssignmentDto.grade}/${submission.assignment.maxPoints} points.`,
      type: 'grade',
    });

    // Send WebSocket notification
    await this.notificationsService.sendWebSocketNotification(
      submission.studentId,
      'gradeUpdated',
      {
        assignmentId: submission.assignmentId,
        submissionId: submission.id,
        grade: gradeAssignmentDto.grade,
        maxPoints: submission.assignment.maxPoints,
        feedback: gradeAssignmentDto.feedback,
        course: submission.assignment.course,
      },
    );

    return updatedSubmission;
  }

  async getStudentAssignments(studentId: string) {
    // Get enrolled courses
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        status: 'approved',
      },
      include: {
        course: {
          include: {
            assignments: {
              include: {
                submissions: {
                  where: {
                    studentId,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten assignments from all enrolled courses
    const assignments = [];
    for (const enrollment of enrollments) {
      for (const assignment of enrollment.course.assignments) {
        assignments.push({
          ...assignment,
          course: enrollment.course,
        });
      }
    }

    return assignments;
  }

  async getLecturerAssignments(lecturerId: string) {
    // Get courses taught by lecturer
    const courses = await this.prisma.course.findMany({
      where: { lecturerId },
      include: {
        assignments: {
          include: {
            submissions: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten assignments from all courses
    const assignments = [];
    for (const course of courses) {
      for (const assignment of course.assignments) {
        assignments.push({
          ...assignment,
          course,
        });
      }
    }

    return assignments;
  }
}
