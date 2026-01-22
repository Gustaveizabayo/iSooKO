import { Controller, Post, Get, UseGuards, Req, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    @Get('active')
    @ApiOperation({ summary: 'Get current user active sessions' })
    @ApiResponse({ status: 200, description: 'List of active sessions' })
    async getActiveSessions(@Req() req: any) {
        // Implementation would need a way to list all data, or iterate keys.
        // For now, return a placeholder or implement key scanning if needed.
        return { message: 'Feature coming: Listing all active sessions' };
    }

    @Post('upgrade-exam')
    @ApiOperation({ summary: 'Upgrade current session to Exam Mode' })
    @ApiResponse({ status: 200, description: 'Session upgraded to EXAM mode' })
    async upgradeToExam(@Req() req: any) {
        await this.sessionService.upgradeToExamSession(req.user.sessionId);
        return { message: 'Session upgraded to EXAM mode. Single-device enforcement active.' };
    }

    @Post('proctor-verify')
    @ApiOperation({ summary: 'Mark session as Proctor Verified' })
    @ApiResponse({ status: 200, description: 'Session marked as proctor-verified' })
    async proctorVerify(@Req() req: any) {
        // In a real app, this would be called after a successful webcam/ID check
        await this.sessionService.markProctorVerified(req.user.sessionId);
        return { message: 'Session marked as proctor-verified.' };
    }

    @Delete(':sessionId')
    @ApiOperation({ summary: 'Invalidate a specific session' })
    @ApiResponse({ status: 200, description: 'Session invalidated' })
    async invalidateSession(@Param('sessionId') sessionId: string) {
        await this.sessionService.invalidateSession(sessionId);
        return { message: 'Session invalidated.' };
    }

    @Delete()
    @ApiOperation({ summary: 'Invalidate all my sessions' })
    @ApiResponse({ status: 200, description: 'All sessions invalidated' })
    async invalidateAll(@Req() req: any) {
        await this.sessionService.invalidateAllUserSessions(req.user.userId);
        return { message: 'All sessions invalidated.' };
    }
}
