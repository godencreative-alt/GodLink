type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 60000);

interface RateLimitConfig {
  windowMs?: number;
  max?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(identifier: string, config: RateLimitConfig = {}): RateLimitResult {
  const { windowMs = 60000, max = 10 } = config;
  const now = Date.now();
  const key = identifier;

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;

  if (entry.count > max) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt
    };
  }

  return {
    success: true,
    remaining: max - entry.count,
    resetAt: entry.resetAt
  };
}

function cleanIp(value: string | null) {
  if (!value) return null;
  const ip = value.split(',')[0].trim();
  if (!ip || ip.toLowerCase() === 'unknown') return null;
  return ip.replace(/^::ffff:/, '');
}

export function getClientIp(request: Request): string {
  return (
    cleanIp(request.headers.get('cf-connecting-ip')) ||
    cleanIp(request.headers.get('true-client-ip')) ||
    cleanIp(request.headers.get('x-real-ip')) ||
    cleanIp(request.headers.get('x-client-ip')) ||
    cleanIp(request.headers.get('x-forwarded-for')) ||
    'unknown'
  );
}