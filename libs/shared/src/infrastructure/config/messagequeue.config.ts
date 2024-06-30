import { Transport } from '@nestjs/microservices';

export default function RabbitMQConfig() {
  return {
    authconfig: {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    },
    notificationsconfig: {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    },
  };
}
