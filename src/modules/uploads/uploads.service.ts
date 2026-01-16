import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
    private readonly uploadPath = path.join(process.cwd(), 'uploads');

    constructor(private prisma: PrismaService) {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async uploadFile(file: Express.Multer.File, userId: string, courseId?: string, lessonId?: string) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/mpeg',
            'application/pdf',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Allowed: JPG, PNG, GIF, MP4, PDF');
        }

        const maxSize = file.mimetype.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(`File too large. Max: ${maxSize / (1024 * 1024)}MB`);
        }

        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const filePath = path.join(this.uploadPath, fileName);

        // Save file locally
        fs.writeFileSync(filePath, file.buffer);

        const relativeUrl = `/uploads/${fileName}`;

        // Determine type
        let type = 'OTHER';
        if (file.mimetype.startsWith('image/')) type = 'IMAGE';
        else if (file.mimetype.startsWith('video/')) type = 'VIDEO';
        else if (file.mimetype === 'application/pdf') type = 'PDF';

        // Save to database
        return this.prisma.attachment.create({
            data: {
                name: file.originalname,
                url: relativeUrl,
                type: type,
                size: file.size,
                mimeType: file.mimetype,
                userId: userId,
                courseId: courseId || null,
                lessonId: lessonId || null,
            },
        });
    }

    async deleteFile(id: string, userId: string) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id },
        });

        if (!attachment) {
            throw new BadRequestException('Attachment not found');
        }

        if (attachment.userId !== userId) {
            throw new BadRequestException('Not authorized to delete this attachment');
        }

        const filePath = path.join(process.cwd(), attachment.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return this.prisma.attachment.delete({
            where: { id },
        });
    }
}
