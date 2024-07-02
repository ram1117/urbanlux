import { Transport } from '@nestjs/microservices';

export enum QUEUE_NAMES {
  AUTH = 'auth_queue',
  NOTIFICATION = 'notification_queue',
}

export default function RabbitMQConfig() {
  return {
    authconfig: {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: QUEUE_NAMES.AUTH,
      },
    },
    notificationsconfig: {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: QUEUE_NAMES.NOTIFICATION,
      },
    },
  };
}
