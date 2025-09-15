import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Fundamental concepts of computer science including programming, algorithms, and data structures.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 3, minimum: 1, maximum: 6 })
  @IsNumber()
  @Min(1)
  @Max(6)
  credits: number;

  @ApiProperty({ example: '/uploads/syllabi/cs101-syllabus.pdf', required: false })
  @IsString()
  @IsOptional()
  syllabusUrl?: string;
}
