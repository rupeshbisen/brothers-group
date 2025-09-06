interface CacheItem<T> {
  data: T;
  timestamp: number;
  staleTime: number;
}

class Cache {
  private cache = new Map<string, CacheItem<unknown>>();

  set<T>(key: string, data: T, staleTime: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    const isStale = now - item.timestamp > item.staleTime;

    if (isStale) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    const isStale = now - item.timestamp > item.staleTime;

    if (isStale) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache age in milliseconds
  getAge(key: string): number | null {
    const item = this.cache.get(key);
    if (!item) return null;
    return Date.now() - item.timestamp;
  }

  // Check if cache is stale without deleting it
  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;

    const now = Date.now();
    return now - item.timestamp > item.staleTime;
  }
}

// Create a singleton instance
export const cache = new Cache();

// Cache keys for dashboard
export const CACHE_KEYS = {
  DASHBOARD_STATS: "dashboard-stats",
  RECENT_UPLOADS: "recent-uploads",
  RECENT_DONATIONS: "recent-donations",
  RECENT_CONTACTS: "recent-contacts",
} as const;

// Default stale times (in milliseconds)
export const STALE_TIMES = {
  DASHBOARD_STATS: 2 * 60 * 1000, // 2 minutes
  RECENT_UPLOADS: 1 * 60 * 1000, // 1 minute
  RECENT_DONATIONS: 1 * 60 * 1000, // 1 minute
  RECENT_CONTACTS: 30 * 1000, // 30 seconds
} as const;

// Utility functions for common cache operations
export const clearDashboardCache = () => {
  cache.delete(CACHE_KEYS.DASHBOARD_STATS);
  cache.delete(CACHE_KEYS.RECENT_UPLOADS);
  cache.delete(CACHE_KEYS.RECENT_DONATIONS);
  cache.delete(CACHE_KEYS.RECENT_CONTACTS);
};

export const clearAllCache = () => {
  cache.clear();
};

// Usage examples:
// 1. Clear dashboard cache when data is modified in other pages:
//    import { clearDashboardCache } from '@/lib/cache';
//    clearDashboardCache(); // Call this after creating/updating/deleting data
//
// 2. Clear specific cache entry:
//    import { cache, CACHE_KEYS } from '@/lib/cache';
//    cache.delete(CACHE_KEYS.DASHBOARD_STATS);
//
// 3. Check if cache is stale:
//    if (cache.isStale(CACHE_KEYS.DASHBOARD_STATS)) {
//      // Cache is stale, fetch new data
//    }
