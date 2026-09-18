import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redis = null;
let redisAvailable = false;

export async function initRedis() {
  if (!env.redisUrl) {
    logger.warn('redis_disabled', { reason: 'REDIS_URL missing' });
    return null;
  }

  try {
    redis = createClient({ url: env.redisUrl });
    redis.on('error', (err) => {
      redisAvailable = false;
      logger.error('redis_error', { error: err.message });
    });
    redis.on('ready', () => {
      redisAvailable = true;
      logger.info('redis_connected');
    });
    await redis.connect();
    return redis;
  } catch (error) {
    redisAvailable = false;
    logger.warn('redis_unavailable', { error: error.message });
    return null;
  }
}

export function getRedis() {
  return redis;
}

export function isRedisAvailable() {
  return redisAvailable && !!redis;
}
