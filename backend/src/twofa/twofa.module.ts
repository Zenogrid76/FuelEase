import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwoFactorAuthService } from './twofa.service';
import { TwoFactorAuthController } from './twofa.controller';

@Module({
  imports: [MailerModule],
  providers: [TwoFactorAuthService],
  controllers: [TwoFactorAuthController],
  exports: [TwoFactorAuthService], 
})
export class TwoFactorAuthModule {}
