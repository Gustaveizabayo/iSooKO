import { Controller, Post, Delete, Param, UseGuards, UploadedFile, UseInterceptors, Query, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a file' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('courseId') courseId?: string,
        @Query('lessonId') lessonId?: string,
        @Req() req?: any,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const userId = req.user?.id;
        if (!userId) {
            throw new BadRequestException('User not authenticated');
        }

        return this.uploadsService.uploadFile(file, userId, courseId, lessonId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a file' })
    async deleteFile(@Param('id') id: string, @Req() req?: any) {
        const userId = req.user?.id;
        if (!userId) {
            throw new BadRequestException('User not authenticated');
        }

        return this.uploadsService.deleteFile(id, userId);
    }
}
