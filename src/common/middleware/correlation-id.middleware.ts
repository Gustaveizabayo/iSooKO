import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    private readonly logger = new Logger(CorrelationIdMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        // Generate or use existing correlation ID
        const correlationId = req.headers['x-correlation-id'] as string || uuidv4();

        // Attach to request
        (req as any)['correlationId'] = correlationId;

        // Add to response headers
        res.setHeader('X-Correlation-ID', correlationId);

        // Log request with correlation ID
        this.logger.log(`[${correlationId}] ${req.method} ${req.url}`);

        next();
    }
}
