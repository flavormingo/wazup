import Redis from 'ioredis';
import { config } from './config.js';

export function createRedis(): Redis {
  return new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}

export function createRedisSub(): Redis {
  return new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}
