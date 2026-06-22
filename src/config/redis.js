const Redis = require('ioredis');

// Create Redis client with environment variables
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: false,
  enableOfflineQueue: false
});

// Error handler - logs but doesn't crash the app
redisClient.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('close', () => {
  console.log('Redis client connection closed');
});

module.exports = redisClient;