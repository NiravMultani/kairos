export function validateEnv(config: Record<string, unknown>) {
  const invalidEnv: string[] = [];

  const requiredEnv = [
    'REDIS_HOST',
    'REDIS_PORT',
    'RABBITMQ_URL',
    'RABBITMQ_QUEUE',
  ];

  requiredEnv.forEach((env) => {
    if (!config[env]) {
      invalidEnv.push(env);
    }
  });

  if (invalidEnv.length > 0) {
    throw new Error(
      `\x1b[1m\x1b[31m Please set value for required env variables: ${invalidEnv.join(
        ',',
      )} \x1b[0m`,
    );
  }

  return config;
}
