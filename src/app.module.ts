import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  loggerConfig,
  redisConfigList,
  rmqConfigList,
  validateEnv,
} from './config';
import { KairosProcessor } from './kairos.processor';
import {
  DEFAULT_QUEUE,
  ENV_NAMESPACES,
  RMQ_QUEUE,
  RMQ_QUEUE_OPTIONS,
  ServiceNames,
} from './tokens';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      expandVariables: true,
      load: [rmqConfigList, redisConfigList, loggerConfig],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return configService.get(`${ENV_NAMESPACES.LOGGER}`);
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: DEFAULT_QUEUE,
    }),
    ClientsModule.registerAsync({
      clients: [
        // Other microservices to call on execution of scheduled tasks
        {
          name: ServiceNames.INBOX_SERVICE,
          useFactory: (configService: ConfigService) =>
            ({
              transport: Transport.RMQ,
              options: {
                urls: configService.get(`${ENV_NAMESPACES.RMQ}.urls`),
                queue: RMQ_QUEUE.INBOX,
                queueOptions: RMQ_QUEUE_OPTIONS[RMQ_QUEUE.INBOX],
              },
            }) as RmqOptions,
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KairosProcessor],
})
export class AppModule {}
