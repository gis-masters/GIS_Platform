export interface CacheItem<T> {
  value: T;
  createdAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  totalAccesses: number;
}
