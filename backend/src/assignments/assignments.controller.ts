import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Roles(UserRole.lecturer, UserRole.admin)
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req) {
    return this.assignmentsService.create(createAssignmentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get assignments' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req) {
    if (req.user.role === 'student') {
      return this.assignmentsService.getStudentAssignments(req.user.id);
    } else if (req.user.role === 'lecturer') {
      return this.assignmentsService.getLecturerAssignments(req.user.id);
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.lecturer, UserRole.admin)
  @ApiOperation({ summary: 'Update assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto, @Request() req) {
    return this.assignmentsService.update(id, updateAssignmentDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.lecturer, UserRole.admin)
  @ApiOperation({ summary: 'Delete assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.assignmentsService.remove(id, req.user.id);
  }

  @Post(':id/submit')
  @Roles(UserRole.student)
  @ApiOperation({ summary: 'Submit assignment' })
  @ApiResponse({ status: 201, description: 'Assignment submitted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Not enrolled in course' })
  @ApiResponse({ status: 409, description: 'Already submitted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  submitAssignment(@Param('id') id: string, @Body() submitAssignmentDto: SubmitAssignmentDto, @Request() req) {
    return this.assignmentsService.submitAssignment(id, submitAssignmentDto, req.user.id);
  }

  @Post(':id/submit/file')
  @Roles(UserRole.student)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit assignment with file upload' })
  @ApiResponse({ status: 201, description: 'Assignment submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async submitAssignmentWithFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @Request() req,
  ) {
    const fileUrl = await this.uploadService.uploadFile(file, 'submissions');
    
    const submitDto: SubmitAssignmentDto = {
      content,
      fileUrl,
    };

    return this.assignmentsService.submitAssignment(id, submitDto, req.user.id);
  }

  @Patch(':id/submissions/:submissionId/grade')
  @Roles(UserRole.lecturer, UserRole.admin)
  @ApiOperation({ summary: 'Grade assignment submission' })
  @ApiResponse({ status: 200, description: 'Assignment graded successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  gradeAssignment(
    @Param('id') assignmentId: string,
    @Param('submissionId') submissionId: string,
    @Body() gradeAssignmentDto: GradeAssignmentDto,
    @Request() req,
  ) {
    return this.assignmentsService.gradeAssignment(assignmentId, submissionId, gradeAssignmentDto, req.user.id);
  }
}
