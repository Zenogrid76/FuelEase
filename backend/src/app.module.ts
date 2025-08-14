import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorAuthModule } from './twofa/twofa.module'; 

@Module({
  imports: [
    // ✅ Load environment variables from .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'Fuel',
      synchronize: true, 
      autoLoadEntities: true,
    }),

    // ✅ Mailer configuration
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '465', 10),
        secure: true, 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"FuelEase Support" <${process.env.MAIL_USER}>`,
      },
    }),

    AdminModule,
    CustomerModule,
    AuthModule,
    TwoFactorAuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
