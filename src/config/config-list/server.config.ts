import { registerAs } from '@nestjs/config';
import { ENV_NAMESPACES } from '../../tokens';

export const serverConfigList = registerAs(ENV_NAMESPACES.SERVER, () => ({
  port: process.env.PORT,
}));
