import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyllabusGenerationDto {
  @ApiProperty({ 
    example: 'Machine Learning',
    description: 'Course topic or subject'
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ 
    example: 'Intermediate',
    description: 'Course level',
    enum: ['Beginner', 'Intermediate', 'Advanced']
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ 
    example: '16',
    description: 'Course duration in weeks',
    required: false
  })
  @IsNumber()
  @Min(4)
  @Max(32)
  @IsOptional()
  duration?: number;

  @ApiProperty({ 
    example: [
      'Understand machine learning algorithms',
      'Apply ML techniques to real-world problems',
      'Evaluate model performance'
    ],
    description: 'Learning objectives',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  learningObjectives?: string[];
}
