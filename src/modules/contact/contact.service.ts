import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from '../../utils/email.service';

@Injectable()
export class ContactService {
    constructor(private readonly emailService: EmailService) { }

    async sendMessage(data: any) {
        // In a real app, you might validate data or save it to DB
        // Here we just forward it via email

        // Construct email content
        const subject = `New Contact Form Submission: ${data.service || 'Inquiry'}`;
        const content = `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
        ${data.message}
      </blockquote>
    `;

        try {
            // Send to admin email (using configured SMTP_USER or a specific admin mail)
            // For now, we reuse the configured user as receiver or a fallback
            // Assuming sendOtpEmailDirect is generic or we add a specific sendGenericEmail

            // Since emailService.sendOtpEmailDirect is specific, let's create a generic send method in EmailService later.
            // For now, I'll bypass EmailService limitation by checking if it has a generic send method. 
            // I'll update EmailService to support generic emails first.

            // But wait, let's check EmailService again to see if I need to update it.
            await this.emailService.sendContactEmail(data);

            return { success: true, message: 'Message sent successfully' };
        } catch (error) {
            console.error('Contact form error:', error);
            throw new InternalServerErrorException('Failed to send message');
        }
    }
}
