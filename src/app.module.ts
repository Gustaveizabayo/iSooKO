import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { MetricsMiddleware } from './common/middleware/metrics.middleware';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SessionModule } from './modules/session/session.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    PaymentsModule,
    DashboardModule,
    UploadsModule,
    ProfilesModule,
    SessionModule,
    ReviewsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
