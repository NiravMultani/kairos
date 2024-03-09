import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { ENV_NAMESPACES } from '../../tokens';

/*
  see additional options for logger here:
  https://github.com/pinojs/pino-http#pinohttpopts-stream
*/

const DEVELOPMENT_LOGGER_CONFIGS = {
  // local / development configurations
  quietReqLogger: true,
  level: 'debug',
  genReqId: () => randomUUID(),
  transport: {
    target: 'pino-pretty',
    options: {
      // singleLine: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      levelFirst: true,
      ignore: 'pid,res',
    },
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
    }),
  },
};

const PRODUCTION_LOGGER_CONFIGS = {
  level: 'info',
  genReqId: () => randomUUID(),
};

export const loggerConfig = registerAs(ENV_NAMESPACES.LOGGER, () => {
  if (process.env.LOG_MODE?.includes('prod')) {
    return {
      pinoHttp: PRODUCTION_LOGGER_CONFIGS,
    };
  }
  return {
    pinoHttp: DEVELOPMENT_LOGGER_CONFIGS,
  };
});
