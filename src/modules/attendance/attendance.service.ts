import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AttendanceType, AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async logAttendance(userId: string, courseId: string, type: AttendanceType, status: AttendanceStatus, metadata?: any) {
        return this.prisma.attendance.create({
            data: {
                userId,
                courseId,
                type,
                status,
                metadata: metadata || {},
            },
        });
    }

    async logVideoWatch(userId: string, lessonId: string, watchDuration: number, lastPosition: number, completed: boolean) {
        return this.prisma.videoAnalytics.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: {
                watchDuration: { increment: watchDuration },
                lastPosition,
                completed,
            },
            create: {
                userId,
                lessonId,
                watchDuration,
                lastPosition,
                completed,
            },
        });
    }

    async getCourseAttendanceReport(courseId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        const report = await Promise.all(
            enrollments.map(async (e) => {
                const attendanceLogs = await this.prisma.attendance.findMany({
                    where: { userId: e.userId, courseId },
                });

                const videoWatchLogs = await this.prisma.videoAnalytics.findMany({
                    where: { userId: e.userId, lesson: { module: { courseId } } },
                });

                const totalLessons = await this.prisma.lesson.count({
                    where: { module: { courseId } },
                });

                const completedLessons = videoWatchLogs.filter((v) => v.completed).length;
                const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

                // Simple calculation for hybrid attendance
                const presentCount = attendanceLogs.filter((a) => a.status === AttendanceStatus.PRESENT).length;
                // Assume total possible live sessions/checks...

                return {
                    student: e.user,
                    completionRate: parseFloat(completionRate.toFixed(1)),
                    liveAttendanceCount: presentCount,
                    lastActive: e.enrolledAt, // Should update based on logs
                };
            }),
        );

        return report;
    }
}
