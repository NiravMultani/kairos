import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ENV_NAMESPACES } from './tokens';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: configService.get(`${ENV_NAMESPACES.RMQ}`),
  });
  await app.startAllMicroservices();
  await app.listen(configService.get(`${ENV_NAMESPACES.SERVER}.port`));
  app.get(Logger).log(`🚀 kairos bootstrapped`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error bootstrapping kairos ', err);
});
