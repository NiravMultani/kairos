import { registerAs } from '@nestjs/config';
import { ENV_NAMESPACES } from 'src/tokens';

export const redisConfigList = registerAs(ENV_NAMESPACES.REDIS, () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
}));
