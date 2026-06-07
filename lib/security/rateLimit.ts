// lib/security/rateLimit.ts
// Shared-store rate limiter with Upstash REST support.
// Falls back to in-memory buckets when shared store credentials are absent.
// Use UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (or Vercel KV
// equivalents) in production so throttling is enforced across instances.

interface Bucket {
  count: number;
  windowStart: number;
}

const store = new Map<string, Bucket>();

function getSharedStoreConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function sharedStoreCommand<T>(
  command: string,
  ...args: Array<string | number>
): Promise<T | null> {
  const config = getSharedStoreConfig();
  if (!config) {
    return null;
  }

  const path = [command, ...args.map((arg) => String(arg))]
    .map((part) => encodeURIComponent(part))
    .join("/");

  try {
    const response = await fetch(`${config.url}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as { result?: T };
    return json.result ?? null;
  } catch {
    return null;
  }
}

function memoryKey(key: string) {
  return `apc:rate-limit:${key}`;
}

function checkRateLimitMemory(
  key: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now - existing.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

function retryAfterSecondsMemory(key: string, windowMs = 60_000): number {
  const bucket = store.get(key);
  if (!bucket) return 0;
  const elapsed = Date.now() - bucket.windowStart;
  return Math.ceil((windowMs - elapsed) / 1000);
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 *
 * @param key        Identifier — typically the client IP or user ID.
 * @param limit      Max requests allowed per window (default 10).
 * @param windowMs   Window size in milliseconds (default 60 000 = 1 min).
 */
export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<boolean> {
  const sharedKey = memoryKey(key);

  if (!getSharedStoreConfig()) {
    return checkRateLimitMemory(sharedKey, limit, windowMs);
  }

  const count = await sharedStoreCommand<number>("INCR", sharedKey);
  if (count === null) {
    return checkRateLimitMemory(sharedKey, limit, windowMs);
  }

  if (count === 1) {
    await sharedStoreCommand("PEXPIRE", sharedKey, windowMs);
  }

  return count <= limit;
}

/**
 * Returns the number of seconds until the current window resets.
 */
export async function retryAfterSeconds(key: string, windowMs = 60_000): Promise<number> {
  const sharedKey = memoryKey(key);

  if (!getSharedStoreConfig()) {
    return retryAfterSecondsMemory(sharedKey, windowMs);
  }

  const ttl = await sharedStoreCommand<number>("PTTL", sharedKey);
  if (ttl === null) {
    return retryAfterSecondsMemory(sharedKey, windowMs);
  }

  return ttl > 0 ? Math.ceil(ttl / 1000) : 0;
}
