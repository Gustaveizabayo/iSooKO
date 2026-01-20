import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../../utils/email.service';
import { Logger } from '@nestjs/common';

@Processor('mail')
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case 'send-otp':
                await this.emailService.sendOtpEmailDirect(job.data.to, job.data.otpCode);
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
}
