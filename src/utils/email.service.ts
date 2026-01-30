import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER') || 'test@example.com',
        pass: this.configService.get<string>('SMTP_PASS') || 'password',
      },
    });
  }

  async sendOtpEmailDirect(to: string, otpCode: string): Promise<void> {
    const mailOptions = {
      from: `"Course Platform" <${this.configService.get<string>('SMTP_USER') || 'noreply@courseplatform.com'}>`,
      to,
      subject: 'Verify Your Email - Course Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @media screen and (max-width: 600px) {
              .content { padding: 20px !important; }
              .step { display: block !important; width: 100% !important; margin-bottom: 20px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #0A2540; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; display: inline-block;">
                <span style="color: #FFD43B;">I</span>SooKO
              </h1>
              <div style="color: #ffffff; font-size: 14px; margin-top: 10px; opacity: 0.9; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Empowering Learners Everywhere</div>
            </div>

            <div class="content" style="padding: 40px 30px;">
              <!-- Verification Section -->
              <div style="text-align: center; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #edf2f7;">
                <h2 style="color: #0A2540; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify it's you</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">We noticed a recent attempt to sign in to your iSooKO account. To complete your registration, please confirm your email address.</p>
                
                <div style="font-size: 32px; font-weight: 800; color: #0A2540; letter-spacing: 4px; margin: 24px 0; background: #f7fafc; padding: 16px; border-radius: 12px; display: inline-block; border: 2px dashed #0A2540;">
                  ${otpCode}
                </div>

                <div style="margin: 20px 0;">
                  <a href="http://localhost:5173/verify-email?code=${otpCode}&email=${encodeURIComponent(to)}" style="display: inline-block; background-color: #FFD43B; color: #0A2540; padding: 16px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(255, 212, 59, 0.2);">Verify My Account</a>
                </div>
                
                <p style="font-size: 13px; color: #718096; margin-top: 20px;">If this wasn't you, ignore this email or contact support.</p>
              </div>

              <!-- Welcome Section -->
              <div style="text-align: center;">
                <h2 style="color: #0A2540; font-size: 24px; font-weight: 700; margin-bottom: 10px;">Welcome to iSooKO!</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We're excited to have you join our learning community. iSooKO is designed to make learning flexible, accessible, and inspiring.</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                  <tr>
                    <td class="step" width="33%" style="text-align: center; vertical-align: top; padding: 10px;">
                      <div style="width: 48px; height: 48px; background-color: #eff6ff; border-radius: 50%; display: inline-block; margin-bottom: 12px; line-height: 48px; font-size: 20px;">📘</div>
                      <div style="font-weight: 700; color: #0A2540; font-size: 14px; margin-bottom: 4px;">Explore Courses</div>
                      <div style="font-size: 12px; color: #718096; line-height: 1.4;">Browse curated subjects taught by experts</div>
                    </td>
                    <td class="step" width="33%" style="text-align: center; vertical-align: top; padding: 10px;">
                      <div style="width: 48px; height: 48px; background-color: #eff6ff; border-radius: 50%; display: inline-block; margin-bottom: 12px; line-height: 48px; font-size: 20px;">📊</div>
                      <div style="font-weight: 700; color: #0A2540; font-size: 14px; margin-bottom: 4px;">Track Progress</div>
                      <div style="font-size: 12px; color: #718096; line-height: 1.4;">Monitor attendance and lessons</div>
                    </td>
                    <td class="step" width="33%" style="text-align: center; vertical-align: top; padding: 10px;">
                      <div style="width: 48px; height: 48px; background-color: #eff6ff; border-radius: 50%; display: inline-block; margin-bottom: 12px; line-height: 48px; font-size: 20px;">👤</div>
                      <div style="font-weight: 700; color: #0A2540; font-size: 14px; margin-bottom: 4px;">Personalize</div>
                      <div style="font-size: 12px; color: #718096; line-height: 1.4;">Showcase your learning journey</div>
                    </td>
                  </tr>
                </table>
                
                <div style="margin-top: 30px;">
                   <a href="http://localhost:5173/courses" style="color: #0A2540; font-weight: bold; text-decoration: none; border-bottom: 2px solid #FFD43B; padding-bottom: 2px;">Start Learning Now &rarr;</a>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #0A2540; color: #a0aec0; padding: 40px 20px; text-align: center; font-size: 12px;">
              <div style="margin-bottom: 20px;">
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 600;">About Us</a>
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 600;">Courses</a>
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 600;">Contact</a>
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a>
              </div>
              <div style="margin-bottom: 20px;">
                 <span style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 5px; line-height: 32px; color: white; text-align: center; font-family: monospace;">in</span>
                 <span style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 5px; line-height: 32px; color: white; text-align: center; font-family: monospace;">tw</span>
                 <span style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 5px; line-height: 32px; color: white; text-align: center; font-family: monospace;">fb</span>
              </div>
              <p style="margin: 5px 0;">&copy; 2026 iSooKO Learning Platform. All rights reserved.</p>
              <p style="margin: 5px 0;">Empowering Learners Everywhere.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw error - allow registration to proceed even if email fails
    }
  async sendContactEmail(data: any): Promise < void> {
      const mailOptions = {
        from: `"${data.firstName} ${data.lastName}" <${this.configService.get<string>('SMTP_USER')}>`, // Send from system email but with user's name
        replyTo: data.email, // Reply to the user
        to: this.configService.get<string>('SMTP_USER') || 'admin@isooko.com',
        subject: `New Contact Form Submission: ${data.service}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #0A2540;">New Contact Message</h2>
                <div style="margin-bottom: 20px;">
                    <p><strong>From:</strong> ${data.firstName} ${data.lastName}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #FFD43B;">
                    <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">Received via iSooKO Contact Form</p>
            </div>
        `,
      };

      try {
        await this.transporter.sendMail(mailOptions);
      } catch(error) {
        console.error('Failed to send contact email:', error);
        throw error;
      }
    }
  }