import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../../session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    // Validate session if sessionId is present
    if (payload.sessionId) {
      const session = await this.sessionService.getSession(payload.sessionId);
      if (!session) {
        throw new UnauthorizedException('Session expired or revoked');
      }

      // IP Check for Exams (Strict)
      const currentIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      if (session.context === 'EXAM' && session.ipAddress !== currentIp) {
        throw new UnauthorizedException('Concurrent session detected from different IP');
      }

      // Heartbeat refresh
      await this.sessionService.refreshSession(payload.sessionId);
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId, // Keep sessionId in req.user for later use (e.g. logout)
    };
  }
}