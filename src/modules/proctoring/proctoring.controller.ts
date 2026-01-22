import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProctoringService } from './proctoring.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExamSessionGuard } from '../../common/guards/exam-session.guard';

@ApiTags('Proctoring & Exams')
@Controller('proctoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProctoringController {
    constructor(private readonly proctoringService: ProctoringService) { }

    @Post('start/:lessonId')
    @UseGuards(ExamSessionGuard)
    @ApiOperation({ summary: 'Start an exam attempt (Requires Exam Session)' })
    async startExam(@Req() req: any, @Param('lessonId') lessonId: string) {
        return this.proctoringService.startExam(req.user.userId, lessonId);
    }

    @Post('log-violation/:attemptId')
    @ApiOperation({ summary: 'Log a proctoring violation (AI behavior analysis)' })
    async logViolation(
        @Param('attemptId') attemptId: string,
        @Body() body: { type: string; severity: string; snapshotUrl?: string },
    ) {
        return this.proctoringService.logViolation(attemptId, body.type, body.severity, body.snapshotUrl);
    }

    @Post('submit/:attemptId')
    @ApiOperation({ summary: 'Submit an exam attempt' })
    async submitExam(
        @Param('attemptId') attemptId: string,
        @Body() body: { score: number },
    ) {
        return this.proctoringService.submitExam(attemptId, body.score);
    }

    @Get('report/:attemptId')
    @ApiOperation({ summary: 'Get proctoring violations for an attempt' })
    async getReport(@Param('attemptId') attemptId: string) {
        return this.proctoringService.getProctoringReport(attemptId);
    }
}
