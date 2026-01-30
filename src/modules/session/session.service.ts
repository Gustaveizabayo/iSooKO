import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
export class SessionService implements OnModuleInit {
    // In-memory store to replace Redis for local development
    private memoryStore = new Map<string, string>();
    private expirationStore = new Map<string, number>(); // Key -> Expiration Timestamp

    public sessionEvents = new Subject<{ event: string; session: SessionData }>();

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        // Cleanup expired keys periodically
        setInterval(() => {
            const now = Date.now();
            this.expirationStore.forEach((expiry, key) => {
                if (now > expiry) {
                    this.memoryStore.delete(key);
                    this.expirationStore.delete(key);
                }
            });
        }, 60000); // Check every minute
    }

    private async set(key: string, value: string, mode?: string, duration?: number): Promise<void> {
        this.memoryStore.set(key, value);
        if (mode === 'EX' && duration) {
            this.expirationStore.set(key, Date.now() + duration * 1000);
        }
    }

    private async get(key: string): Promise<string | null> {
        const expiry = this.expirationStore.get(key);
        if (expiry && Date.now() > expiry) {
            this.memoryStore.delete(key);
            this.expirationStore.delete(key);
            return null;
        }
        return this.memoryStore.get(key) || null;
    }

    private async del(key: string): Promise<void> {
        this.memoryStore.delete(key);
        this.expirationStore.delete(key);
    }

    // Helper to simulate Redis sets (SADD, SMEMBERS, SREM)
    private async sadd(key: string, value: string): Promise<void> {
        const setStr = await this.get(key);
        const set = setStr ? new Set(JSON.parse(setStr)) : new Set<string>();
        set.add(value);
        await this.set(key, JSON.stringify(Array.from(set)));
    }

    private async smembers(key: string): Promise<string[]> {
        const setStr = await this.get(key);
        return setStr ? JSON.parse(setStr) : [];
    }

    private async srem(key: string, value: string): Promise<void> {
        const setStr = await this.get(key);
        if (setStr) {
            const set = new Set(JSON.parse(setStr));
            set.delete(value);
            await this.set(key, JSON.stringify(Array.from(set)));
        }
    }

    // --- Public API ---

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
            const existingExamSessionId = await this.get(`user:${userId}:exam_session`);
            if (existingExamSessionId) {
                await this.invalidateSession(existingExamSessionId);
            }
            // Set new exam session pointer
            await this.set(`user:${userId}:exam_session`, sessionId);
        }

        // Save session data (TTL: 24 hours for general, or specific for exam)
        const ttl = context === SessionContext.EXAM ? 7200 : 86400; // 2 hours for exam, 24h general
        await this.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', ttl);

        // Track user sessions
        await this.sadd(`user:${userId}:sessions`, sessionId);

        return sessionId;
    }

    async getSession(sessionId: string): Promise<SessionData | null> {
        const data = await this.get(`session:${sessionId}`);
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
            // await this.redis.expire(`session:${sessionId}`, ttl); // Simulate expire update by re-setting
            session.lastActive = Date.now();
            await this.set(`session:${sessionId}`, JSON.stringify(session), 'EX', ttl);
        }
    }

    async invalidateSession(sessionId: string) {
        const session = await this.getSession(sessionId);
        if (session) {
            await this.del(`session:${sessionId}`);
            await this.srem(`user:${session.userId}:sessions`, sessionId);

            if (session.context === SessionContext.EXAM) {
                await this.del(`user:${session.userId}:exam_session`);
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
        const existingExamSessionId = await this.get(`user:${session.userId}:exam_session`);
        if (existingExamSessionId && existingExamSessionId !== sessionId) {
            // Invalidate the other exam session
            await this.invalidateSession(existingExamSessionId);
        }

        session.context = SessionContext.EXAM;
        session.lastActive = Date.now();

        // Save with shorter TTL for exams (2 hours)
        await this.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 7200);
        await this.set(`user:${session.userId}:exam_session`, sessionId);
    }

    async markProctorVerified(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (session) {
            session.proctorVerified = true;
            await this.set(`session:${sessionId}`, JSON.stringify(session) /* Keep existing TTL logic roughly */);
        }
    }

    async invalidateAllUserSessions(userId: string) {
        const sessions = await this.smembers(`user:${userId}:sessions`);
        for (const sessionId of sessions) {
            await this.invalidateSession(sessionId);
        }
    }
}
