import { Provider } from '@nestjs/common';
import * as Pusher from 'pusher';

export const PusherProvider: Provider = {
  provide: 'PUSHER',
  useFactory: () => {
    return new Pusher({
      appId: '2051142',
      key: 'fcc5fc876ed2aea7de89',
      secret: '4d5d4e892fb66a0b86b5',
      cluster: 'ap1',
      useTLS: true,
    });
  },
};
