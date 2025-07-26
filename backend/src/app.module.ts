import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'postgres', 
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'FuelEase',
     synchronize: true,
      autoLoadEntities: true,}),
    AdminModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
