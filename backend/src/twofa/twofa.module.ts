import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwoFactorAuthService } from './twofa.service';
import { TwoFactorAuthController } from './twofa.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [MailerModule, AdminModule],
  providers: [TwoFactorAuthService],
  controllers: [TwoFactorAuthController],
  exports: [TwoFactorAuthService], 
})
export class TwoFactorAuthModule {}
