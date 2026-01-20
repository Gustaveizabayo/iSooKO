import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailQueueService {
    constructor(@InjectQueue('mail') private mailQueue: Queue) { }

    async sendOtpEmail(to: string, otpCode: string) {
        await this.mailQueue.add('send-otp', {
            to,
            otpCode,
        });
    }
}
