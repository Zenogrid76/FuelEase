import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TwoFactorAuthService {
  constructor(private mailerService: MailerService) {}

  async sendTwoFactorCode(email: string, otpCode: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your 2FA Code',
      text: `Your two-factor authentication code is ${otpCode}`,
      html: `<b>Your two-factor authentication code is: ${otpCode}</b>`,
    });
  }
}
