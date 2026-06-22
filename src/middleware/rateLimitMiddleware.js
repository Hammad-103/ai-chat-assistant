const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('../config/redis');

// Create rate limiter instance
let rateLimiter = null;

try {
  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rl_message_',
    points: 10,
    duration: 60,
    blockDurationMs: 0
  });
} catch (error) {
  console.error('Failed to initialize rate limiter:', error.message);
}

/**
 * Rate limiting middleware for chat messages
 * Limits: 10 requests per 60 seconds, keyed by userId or IP
 */
const rateLimitMiddleware = async (req, res, next) => {
  try {
    if (!rateLimiter) {
      return next();
    }

    const key = req.user?.userId ? `user_${req.user.userId}` : req.ip;

    try {
      await rateLimiter.consume(key, 1);

      next();
    } catch (rejRes) {
      // Differentiate between rate limit exceeded and Redis connection errors
      if (rejRes instanceof Error) {
        // Redis/connection failure - log and fail open
        console.error('Rate limiter Redis error:', rejRes.message);
        next();
      } else {
        // Rate limit exceeded (rejRes is RateLimiterRes object)
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }
    }
  } catch (error) {
    console.error('Rate limiter error:', error.message);
    next();
  }
};

module.exports = { rateLimitMiddleware };