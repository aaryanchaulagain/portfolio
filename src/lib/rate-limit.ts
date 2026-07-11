/**
 * Simple in-memory rate limiter for serverless-friendly abuse control.
 * For multi-instance production, replace with Redis / Upstash.
 */
type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export function rateLimit({
  key,
  limit = 5,
  windowMs = 60_000,
}: {
  key: string;
  limit?: number;
  windowMs?: number;
}) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(key, existing);
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Test helper — clears in-memory rate limit state. */
export function resetRateLimitStore() {
  store.clear();
}
