import { Controller, Post, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:courseId/enroll')
  @Roles(UserRole.student)
  @ApiOperation({ summary: 'Request enrollment in a course' })
  @ApiResponse({ status: 201, description: 'Enrollment requested successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled or pending' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async requestEnrollment(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.requestEnrollment(courseId, req.user.id);
  }

  // Alias to match spec: POST /courses/:id/enroll
  @Post('/../courses/:courseId/enroll')
  @Roles(UserRole.student)
  @ApiOperation({ summary: 'Request enrollment in a course (alias)' })
  @ApiResponse({ status: 201, description: 'Enrollment requested successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled or pending' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async requestEnrollmentAlias(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.requestEnrollment(courseId, req.user.id);
  }

  @Get('pending')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get pending enrollment requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending enrollments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPendingEnrollments() {
    return this.enrollmentsService.getPendingEnrollments();
  }

  @Get('my-enrollments')
  @Roles(UserRole.student)
  @ApiOperation({ summary: 'Get my enrollments' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMyEnrollments(@Request() req) {
    return this.enrollmentsService.getStudentEnrollments(req.user.id);
  }

  @Patch(':id/approve')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Approve enrollment request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Enrollment approved successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  @ApiResponse({ status: 409, description: 'Enrollment not pending' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async approveEnrollment(@Param('id') id: string, @Request() req) {
    return this.enrollmentsService.approveEnrollment(id, req.user.id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Reject enrollment request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Enrollment rejected successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  @ApiResponse({ status: 409, description: 'Enrollment not pending' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async rejectEnrollment(@Param('id') id: string, @Request() req) {
    return this.enrollmentsService.rejectEnrollment(id, req.user.id);
  }
}
