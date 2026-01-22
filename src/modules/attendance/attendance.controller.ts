import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';
import { AttendanceType, AttendanceStatus } from '@prisma/client';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('onsite-checkin')
    @ApiOperation({ summary: 'Log on-site attendance (via QR/Manual)' })
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async onsiteCheckin(
        @Body() body: { userId: string; courseId: string; metadata?: any },
    ) {
        return this.attendanceService.logAttendance(
            body.userId,
            body.courseId,
            AttendanceType.ONSITE,
            AttendanceStatus.PRESENT,
            body.metadata,
        );
    }

    @Post('video-progress')
    @ApiOperation({ summary: 'Track video watch progress' })
    async trackVideoProgress(
        @Req() req: any,
        @Body() body: { lessonId: string; watchDuration: number; lastPosition: number; completed: boolean },
    ) {
        return this.attendanceService.logVideoWatch(
            req.user.userId,
            body.lessonId,
            body.watchDuration,
            body.lastPosition,
            body.completed,
        );
    }

    @Get('report/:courseId')
    @ApiOperation({ summary: 'Get attendance report for a course' })
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async getReport(@Param('courseId') courseId: string) {
        return this.attendanceService.getCourseAttendanceReport(courseId);
    }
}
