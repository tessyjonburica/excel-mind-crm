import { IsString, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Assignment Graded' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Your assignment has been graded. You received 85/100 points.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ 
    enum: NotificationType,
    example: NotificationType.GRADE
  })
  @IsEnum(NotificationType)
  type: NotificationType;
}
