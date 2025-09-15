import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, lecturerId: string) {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        lecturerId,
      },
      include: {
        lecturer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
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
        assignments: true,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        lecturer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
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
        assignments: true,
        _count: {
          select: {
            enrollments: true,
            assignments: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lecturer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
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

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string, userRole: UserRole) {
    const course = await this.findOne(id);

    // Only lecturer who created the course or admin can update
    if (course.lecturerId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only update your own courses');
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        lecturer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
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
        assignments: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const course = await this.findOne(id);

    // Only lecturer who created the course or admin can delete
    if (course.lecturerId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own courses');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }

  async getCoursesByLecturer(lecturerId: string) {
    return this.prisma.course.findMany({
      where: { lecturerId },
      include: {
        enrollments: {
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
        assignments: true,
        _count: {
          select: {
            enrollments: true,
            assignments: true,
          },
        },
      },
    });
  }

  async getEnrolledCourses(studentId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        status: 'approved',
      },
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

    return enrollments.map(enrollment => enrollment.course);
  }
}
