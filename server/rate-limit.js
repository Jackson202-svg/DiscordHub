/** Simple in-process rate limiter for starter deployments; use a shared store at scale. */
export function createRateLimiter({ windowMs = 60_000, max = 60, now = Date.now } = {}) {
  const clients = new Map();
  let lastSweep = now();

  return function checkLimit(key) {
    const current = now();
    if (current - lastSweep >= windowMs) {
      for (const [clientKey, entry] of clients) {
        if (entry.resetAt <= current) clients.delete(clientKey);
      }
      lastSweep = current;
    }

    let entry = clients.get(key);
    if (!entry || entry.resetAt <= current) {
      entry = { count: 0, resetAt: current + windowMs };
      clients.set(key, entry);
    }
    entry.count += 1;
    return {
      allowed: entry.count <= max,
      limit: max,
      remaining: Math.max(0, max - entry.count),
      resetAt: entry.resetAt
    };
  };
}
