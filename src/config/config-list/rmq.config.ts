import { registerAs } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { ENV_NAMESPACES } from '../../tokens';

export const rmqConfigList = registerAs(ENV_NAMESPACES.RMQ, () => {
  return {
    urls: [process.env.RABBITMQ_URL],
    queue: process.env.RABBITMQ_QUEUE,
    queueOptions: {
      durable: true,
    },
  } as RmqOptions['options'];
});
