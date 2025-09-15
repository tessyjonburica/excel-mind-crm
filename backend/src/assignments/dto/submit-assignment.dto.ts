import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAssignmentDto {
  @ApiProperty({ example: 'I have implemented a basic calculator with addition, subtraction, multiplication, and division operations.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '/uploads/submissions/student1-assignment1.py', required: false })
  @IsString()
  @IsOptional()
  @IsUrl()
  fileUrl?: string;
}
