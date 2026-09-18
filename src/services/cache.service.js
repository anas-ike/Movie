import { getRedis, isRedisAvailable } from '../config/redis.js';

export async function getCache(key) {
  if (!isRedisAvailable()) return null;
  try {
    const redis = getRedis();
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setCache(key, value, ttlSeconds) {
  if (!isRedisAvailable()) return false;
  try {
    const redis = getRedis();
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    return true;
  } catch {
    return false;
  }
}
