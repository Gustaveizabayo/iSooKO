import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { EmailService } from '../../utils/email.service';
import { MailQueueService } from './mail-queue.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail',
        }),
        ConfigModule,
    ],
    providers: [MailProcessor, EmailService, MailQueueService],
    exports: [MailQueueService],
})
export class MailModule { }
