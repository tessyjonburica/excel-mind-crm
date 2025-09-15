import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Programming Project 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Create a simple calculator application using Python.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'course-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 100, minimum: 1 })
  @IsNumber()
  @Min(1)
  maxPoints: number;

  @ApiProperty({ example: '2024-02-15T23:59:59.000Z' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
