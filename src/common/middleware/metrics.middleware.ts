import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as client from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
    // Define custom metrics
    private readonly httpRequestsTotal = new client.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
    });

    private readonly httpRequestDuration = new client.Histogram({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route', 'status_code'],
        buckets: [0.01, 0.05, 0.1, 0.5, 1, 3, 5, 10], // Buckets for response time analysis (10ms to 10s)
    });

    private readonly concurrentRequests = new client.Gauge({
        name: 'http_concurrent_requests',
        help: 'Number of concurrent HTTP requests',
    });

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();
        const method = req.method;
        // Normalize path to avoid high cardinality (optional improvement: use route pattern if available)
        const route = req.baseUrl || req.path;

        // Increment concurrent requests
        this.concurrentRequests.inc();

        res.on('finish', () => {
            // Decrement concurrent requests
            this.concurrentRequests.dec();

            const duration = (Date.now() - start) / 1000;
            const statusCode = res.statusCode.toString();

            // Record metrics
            this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
            this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
        });

        next();
    }
}
