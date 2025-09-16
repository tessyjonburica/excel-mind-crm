import { IsEmail, IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  student = 'student',
  lecturer = 'lecturer',
  admin = 'admin',
}

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@excelmind.edu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.student })
  @IsEnum(UserRole)
  role: UserRole;
}
