import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, subfolder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and DOCX files are allowed');
    }

    // Validate file size (10MB max)
    const maxSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760);
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    // Create subfolder if it doesn't exist
    const uploadPath = path.join('./uploads', subfolder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${subfolder}-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadPath, filename);

    // Save file
    fs.writeFileSync(filepath, file.buffer);

    // Return relative URL
    return `/uploads/${subfolder}/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filepath = path.join('./', fileUrl);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async getFileInfo(fileUrl: string) {
    const filepath = path.join('./', fileUrl);
    
    if (!fs.existsSync(filepath)) {
      throw new BadRequestException('File not found');
    }

    const stats = fs.statSync(filepath);
    return {
      filename: path.basename(filepath),
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  }
}
