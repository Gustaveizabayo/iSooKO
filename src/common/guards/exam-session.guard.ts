import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { SessionService, SessionContext } from '../../modules/session/session.service';

@Injectable()
export class ExamSessionGuard implements CanActivate {
    constructor(private sessionService: SessionService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.sessionId) {
            throw new UnauthorizedException('No active session found');
        }

        const session = await this.sessionService.getSession(user.sessionId);
        if (!session) {
            throw new UnauthorizedException('Session expired or invalid');
        }

        if (session.context !== SessionContext.EXAM) {
            throw new ForbiddenException('This action requires an active Exam Session. Please start the exam to proceed.');
        }

        // Additional check: Ensure this is the current active exam session for the user
        // (In case another device logged in and revoked this one's exam status)
        // Actually, invalidateSession would have deleted the key, so getSession would return null.

        return true;
    }
}
