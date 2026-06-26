export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // in seconds
}

export interface RateLimiter {
  isRateLimited(ip: string): Promise<RateLimitResult>;
}

/**
 * Memory-safe In-Memory Rate Limiter.
 * Prunes expired entries on demand to prevent memory leaks in long-running processes (or dev servers).
 */
export class InMemoryRateLimiter implements RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 5, windowMs = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public async isRateLimited(ip: string): Promise<RateLimitResult> {
    const now = Date.now();
    
    // Clean up expired keys to keep memory usage low
    this.pruneExpired(now);

    const record = this.cache.get(ip);

    if (!record || now > record.resetTime) {
      this.cache.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { allowed: true, retryAfter: 0 };
    }

    if (record.count >= this.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    record.count += 1;
    return { allowed: true, retryAfter: 0 };
  }

  private pruneExpired(now: number): void {
    for (const [ip, record] of this.cache.entries()) {
      if (now > record.resetTime) {
        this.cache.delete(ip);
      }
    }
  }
}

// Single instance for lead capture form (5 requests per 15 minutes)
export const formRateLimiter = new InMemoryRateLimiter(5, 15 * 60 * 1000);
