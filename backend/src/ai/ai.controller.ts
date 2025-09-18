import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CourseRecommendationDto } from './dto/course-recommendation.dto';
import { SyllabusGenerationDto } from './dto/syllabus-generation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Assistant')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend')
  @ApiOperation({ summary: 'Get AI-powered course recommendations' })
  @ApiResponse({ status: 200, description: 'Course recommendations generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async recommendCourses(@Body() recommendationDto: CourseRecommendationDto) {
    return this.aiService.recommendCourses(recommendationDto);
  }

  @Post('syllabus')
  @ApiOperation({ summary: 'Generate AI-powered syllabus' })
  @ApiResponse({ status: 200, description: 'Syllabus generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async generateSyllabus(@Body() syllabusDto: SyllabusGenerationDto) {
    return this.aiService.generateSyllabus(syllabusDto);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  @ApiResponse({ status: 200, description: 'AI response generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async chatWithAI(@Body() body: { message: string }) {
    return this.aiService.chatWithAI(body.message);
  }
}
