import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorController } from './operator.controller';
import { OperatorService } from './operator.service';
import { Operator } from './operator.entity';

import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    TypeOrmModule.forFeature([Operator]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'asifsazid.30@example.com',
          pass: '123445',
        },
      },
      defaults: { from: '"No Reply" <noreply@example.com>' },
    }),
  ],
  providers: [OperatorService],
  controllers: [OperatorController],
  exports: [TypeOrmModule, OperatorService],
})
export class OperatorModule {}