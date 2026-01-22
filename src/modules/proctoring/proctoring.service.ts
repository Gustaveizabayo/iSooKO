import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class ProctoringService {
    constructor(
        private prisma: PrismaService,
        private sessionService: SessionService,
    ) {
        // Listen for session revocation to auto-submit
        this.sessionService.sessionEvents.subscribe(({ event, session }) => {
            if (event === 'exam_revoked') {
                this.autoSubmitExam(session.userId);
            }
        });
    }

    async startExam(userId: string, lessonId: string) {
        return this.prisma.examAttempt.create({
            data: {
                userId,
                lessonId,
                status: 'STARTED',
            },
        });
    }

    async logViolation(attemptId: string, type: string, severity: string, snapshotUrl?: string) {
        return this.prisma.proctorLog.create({
            data: {
                attemptId,
                type,
                severity,
                snapshotUrl,
            },
        });
    }

    async submitExam(attemptId: string, score: number) {
        return this.prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                score,
                status: 'SUBMITTED',
                endTime: new Date(),
            },
        });
    }

    private async autoSubmitExam(userId: string) {
        const activeAttempt = await this.prisma.examAttempt.findFirst({
            where: { userId, status: 'STARTED' },
            orderBy: { startTime: 'desc' },
        });

        if (activeAttempt) {
            await this.prisma.examAttempt.update({
                where: { id: activeAttempt.id },
                data: {
                    status: 'AUTO_SUBMITTED',
                    endTime: new Date(),
                    score: 0, // Or current partial score if available
                },
            });
            console.log(`Auto-submitted exam for user ${userId} due to session loss.`);
        }
    }

    async getProctoringReport(attemptId: string) {
        return this.prisma.proctorLog.findMany({
            where: { attemptId },
            orderBy: { timestamp: 'asc' },
        });
    }
}
