import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AiModule } from './ai/ai.module';
import { TranscriptModule } from './transcript/transcript.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    AssignmentsModule,
    EnrollmentsModule,
    AiModule,
    TranscriptModule,
    NotificationsModule,
    UploadModule,
  ],
})
export class AppModule {}
