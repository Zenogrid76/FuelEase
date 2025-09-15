import { Module } from '@nestjs/common';
import { PusherProvider } from './pusher.provider';

@Module({
  providers: [PusherProvider],
  exports: [PusherProvider], 
})
export class PusherModule {}
