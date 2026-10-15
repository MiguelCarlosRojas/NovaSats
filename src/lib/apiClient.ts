/**
 * NovaSats Client-Side High-Performance API Client
 * - SWR (Stale-While-Revalidate) In-Memory Cache for ultra-fast loading on slow connections
 * - Automatic retry with exponential backoff for unstable / slow mobile internet
 * - Automatic credentials: 'include' for secure HttpOnly cookie authentication
 * - Zero localStorage usage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 60 * 1000; // 1 minute fresh TTL; stale used immediately

export interface RequestOptions extends RequestInit {
  useCache?: boolean;
  ttlMs?: number;
  retries?: number;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  /**
   * High-speed GET with SWR cache & automatic retry
   */
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { useCache = true, ttlMs = DEFAULT_TTL_MS, retries = 2, ...fetchOptions } = options;
    const cacheKey = `GET:${endpoint}`;

    // 1. Instant Cache Hit (Returns immediately in 0ms on slow / 3G connections)
    if (useCache && memoryCache.has(cacheKey)) {
      const entry = memoryCache.get(cacheKey)!;
      const isFresh = Date.now() - entry.timestamp < ttlMs;

      if (isFresh) {
        return entry.data;
      }

      // Background revalidation (SWR)
      this.fetchWithRetry<T>(endpoint, fetchOptions, retries)
        .then((fresh) => {
          memoryCache.set(cacheKey, { data: fresh, timestamp: Date.now() });
        })
        .catch(() => {});

      return entry.data;
    }

    // 2. Network Fetch with automatic retry
    const data = await this.fetchWithRetry<T>(endpoint, fetchOptions, retries);
    if (useCache) {
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  },

  /**
   * POST request (Invalidates related cache entries)
   */
  async post<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const { retries = 1, ...fetchOptions } = options;
    const res = await this.fetchWithRetry<T>(endpoint, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }, retries);

    this.invalidateRelatedCache(endpoint);
    return res;
  },

  /**
   * PUT request (Invalidates related cache entries)
   */
  async put<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const { retries = 1, ...fetchOptions } = options;
    const res = await this.fetchWithRetry<T>(endpoint, {
      ...fetchOptions,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }, retries);

    this.invalidateRelatedCache(endpoint);
    return res;
  },

  /**
   * PATCH request (Invalidates related cache entries)
   */
  async patch<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const { retries = 1, ...fetchOptions } = options;
    const res = await this.fetchWithRetry<T>(endpoint, {
      ...fetchOptions,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }, retries);

    this.invalidateRelatedCache(endpoint);
    return res;
  },

  /**
   * DELETE request (Invalidates related cache entries)
   */
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { retries = 1, ...fetchOptions } = options;
    const res = await this.fetchWithRetry<T>(endpoint, {
      ...fetchOptions,
      method: 'DELETE',
    }, retries);

    this.invalidateRelatedCache(endpoint);
    return res;
  },

  /**
   * Core fetch helper with retry for slow/intermittent connections
   */
  async fetchWithRetry<T = any>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 2
  ): Promise<T> {
    let attempt = 0;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        const res = await fetch(endpoint, {
          ...options,
          credentials: 'include', // Ensure HttpOnly cookies are automatically sent
        });

        if (!res.ok) {
          let errorData: any = {};
          try {
            errorData = await res.json();
          } catch {
            errorData = { error: `Error ${res.status}: ${res.statusText}` };
          }
          throw new Error(errorData.error || errorData.message || `Error en la solicitud (${res.status})`);
        }

        return await res.json();
      } catch (err: any) {
        lastError = err;
        attempt++;
        if (attempt <= maxRetries) {
          // Exponential backoff for bad internet (300ms, 900ms)
          await wait(300 * Math.pow(attempt, 2));
        }
      }
    }

    throw lastError || new Error('No se pudo establecer conexión con el servidor.');
  },

  /**
   * Invalidates cached keys matching an endpoint category
   */
  invalidateRelatedCache(endpoint: string) {
    if (endpoint.includes('products')) {
      for (const key of memoryCache.keys()) {
        if (key.includes('products')) memoryCache.delete(key);
      }
    }
    if (endpoint.includes('orders')) {
      for (const key of memoryCache.keys()) {
        if (key.includes('orders')) memoryCache.delete(key);
      }
    }
    if (endpoint.includes('supplier')) {
      for (const key of memoryCache.keys()) {
        if (key.includes('supplier')) memoryCache.delete(key);
      }
    }
    if (endpoint.includes('reviews')) {
      for (const key of memoryCache.keys()) {
        if (key.includes('reviews')) memoryCache.delete(key);
      }
    }
    if (endpoint.includes('qa')) {
      for (const key of memoryCache.keys()) {
        if (key.includes('qa')) memoryCache.delete(key);
      }
    }
  },

  /**
   * Clear cache for specific endpoint or all if omitted
   */
  clearCache(endpoint?: string) {
    if (!endpoint) {
      memoryCache.clear();
      return;
    }
    const target = `GET:${endpoint}`;
    for (const key of memoryCache.keys()) {
      if (key.startsWith(target)) memoryCache.delete(key);
    }
  },

  /**
   * Clear all in-memory cache
   */
  clearAllCache() {
    memoryCache.clear();
  },
};
