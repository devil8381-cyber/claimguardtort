// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(ip: string, maxRequests: number, windowMs: number = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime <= now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}
