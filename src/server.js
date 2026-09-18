import { createApp } from './app.js';
import { env, validateCriticalEnv } from './config/env.js';
import { testDatabase } from './config/database.js';
import { initRedis } from './config/redis.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  const { missing } = validateCriticalEnv();
  if (missing.length) {
    logger.error('missing_critical_env', { missing });
    process.exit(1);
  }

  await testDatabase();
  await initRedis();

  const app = createApp();
  app.listen(env.port, env.host, () => {
    logger.info('server_started', {
      host: env.host,
      port: env.port,
      env: env.nodeEnv
    });
  });
}

bootstrap().catch((error) => {
  logger.error('startup_failed', { error: error.message });
  process.exit(1);
});
