import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseRecommendationDto {
  @ApiProperty({ 
    example: ['artificial intelligence', 'machine learning', 'data science'],
    description: 'Array of student interests'
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  interests: string[];

  @ApiProperty({ 
    example: ['CS101', 'MATH201'],
    description: 'Array of currently enrolled course codes',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentCourses?: string[];

  @ApiProperty({ 
    example: 'undergraduate',
    description: 'Academic level',
    required: false
  })
  @IsString()
  @IsOptional()
  academicLevel?: string;

  @ApiProperty({ 
    example: ['software developer', 'data scientist', 'AI engineer'],
    description: 'Career goals',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  careerGoals?: string[];
}
