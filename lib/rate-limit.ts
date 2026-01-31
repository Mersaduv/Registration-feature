import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client only if credentials are provided
let redis: Redis | null = null;
let rateLimiter: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  process.env.UPSTASH_REDIS_REST_URL !== "" &&
  process.env.UPSTASH_REDIS_REST_TOKEN !== ""
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Create rate limiter: 5 requests per 10 minutes per IP
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

export { rateLimiter };
