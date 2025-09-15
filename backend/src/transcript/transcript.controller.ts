import { Controller, Get, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TranscriptService } from './transcript.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Transcript')
@Controller('transcript')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Get(':studentId/pdf')
  @ApiOperation({ summary: 'Generate and download student transcript PDF' })
  @ApiResponse({ status: 200, description: 'Transcript PDF generated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateTranscript(
    @Param('studentId') studentId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const { buffer, filename } = await this.transcriptService.generateTranscript(
      studentId,
      req.user.id,
      req.user.role,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
