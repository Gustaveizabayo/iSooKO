import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';

export enum SessionContext {
    GENERAL = 'GENERAL',
    EXAM = 'EXAM',
}

export interface SessionData {
    sessionId: string;
    userId: string;
    deviceId: string;
    context: SessionContext;
    ipAddress: string;
    proctorVerified?: boolean;
    createdAt: number;
    lastActive: number;
    metadata?: Record<string, any>;
}

@Injectable()
export class SessionService implements OnModuleInit, OnModuleDestroy {
    private redis!: Redis;
    public sessionEvents = new Subject<{ event: string; session: SessionData }>();

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.redis = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
        });
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }

    async createSession(
        userId: string,
        context: SessionContext,
        deviceId: string,
        ipAddress: string,
    ): Promise<string> {
        const sessionId = uuidv4();
        const now = Date.now();

        const sessionData: SessionData = {
            sessionId,
            userId,
            deviceId,
            context,
            ipAddress,
            createdAt: now,
            lastActive: now,
        };

        // EXAM LOGIC: Enforce strict single device
        if (context === SessionContext.EXAM) {
            // Find existing exam session for user
            const existingExamSessionId = await this.redis.get(`user:${userId}:exam_session`);
            if (existingExamSessionId) {
                await this.invalidateSession(existingExamSessionId);
            }
            // Set new exam session pointer
            await this.redis.set(`user:${userId}:exam_session`, sessionId);
        }

        // Save session data (TTL: 24 hours for general, or specific for exam)
        const ttl = context === SessionContext.EXAM ? 7200 : 86400; // 2 hours for exam, 24h general
        await this.redis.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', ttl);

        // Track user sessions
        await this.redis.sadd(`user:${userId}:sessions`, sessionId);

        return sessionId;
    }

    async getSession(sessionId: string): Promise<SessionData | null> {
        const data = await this.redis.get(`session:${sessionId}`);
        if (!data) return null;
        return JSON.parse(data);
    }

    async validateSession(sessionId: string): Promise<boolean> {
        const session = await this.getSession(sessionId);
        if (!session) return false;

        // Refresh TTL on activity (heartbeat) - optional here or separate
        return true;
    }

    async refreshSession(sessionId: string) {
        // Keep session alive
        const session = await this.getSession(sessionId);
        if (session) {
            const ttl = session.context === SessionContext.EXAM ? 7200 : 86400;
            await this.redis.expire(`session:${sessionId}`, ttl);
            session.lastActive = Date.now();
            await this.redis.set(`session:${sessionId}`, JSON.stringify(session), 'KEEPTTL'); // Keep existing TTL or reset? usually reset.
        }
    }

    async invalidateSession(sessionId: string) {
        const session = await this.getSession(sessionId);
        if (session) {
            await this.redis.del(`session:${sessionId}`);
            await this.redis.srem(`user:${session.userId}:sessions`, sessionId);

            if (session.context === SessionContext.EXAM) {
                await this.redis.del(`user:${session.userId}:exam_session`);
                // Trigger Auto-Submission logic via event
                this.sessionEvents.next({ event: 'exam_revoked', session });
            } else {
                this.sessionEvents.next({ event: 'revoked', session });
            }
        }
    }

    async upgradeToExamSession(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (!session) throw new Error('Session not found');

        // Check if user already has an active exam session on ANOTHER device/session
        const existingExamSessionId = await this.redis.get(`user:${session.userId}:exam_session`);
        if (existingExamSessionId && existingExamSessionId !== sessionId) {
            // Invalidate the other exam session
            await this.invalidateSession(existingExamSessionId);
        }

        session.context = SessionContext.EXAM;
        session.lastActive = Date.now();

        // Save with shorter TTL for exams (2 hours)
        await this.redis.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 7200);
        await this.redis.set(`user:${session.userId}:exam_session`, sessionId);
    }

    async markProctorVerified(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (session) {
            session.proctorVerified = true;
            await this.redis.set(`session:${sessionId}`, JSON.stringify(session), 'KEEPTTL');
        }
    }

    async invalidateAllUserSessions(userId: string) {
        const sessions = await this.redis.smembers(`user:${userId}:sessions`);
        for (const sessionId of sessions) {
            await this.invalidateSession(sessionId);
        }
    }
}
