import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GradeAssignmentDto {
  @ApiProperty({ example: 85, minimum: 0 })
  @IsNumber()
  @Min(0)
  grade: number;

  @ApiProperty({ example: 'Good implementation! Consider adding error handling for division by zero.', required: false })
  @IsString()
  @IsOptional()
  feedback?: string;
}
