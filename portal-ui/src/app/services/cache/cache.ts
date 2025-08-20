import { services } from '../services';
import { CacheItem, CacheStats } from './models';

export class Cache<T> {
  /**
   * Время жизни кеша в миллисекундах.
   */
  private readonly cacheExpiryTime: number;

  private stats: CacheStats;
  private cache: Map<string, CacheItem<T>>;

  constructor() {
    this.cache = new Map<string, CacheItem<T>>();
    this.cacheExpiryTime = 36_000_000; // По умолчанию 10 часов
    this.stats = {
      hits: 0,
      misses: 0,
      totalAccesses: 0
    };
  }

  addToCache(key: string, value: T): void {
    const cacheItem: CacheItem<T> = {
      value,
      createdAt: Date.now()
    };

    this.cache.set(key, cacheItem);
  }

  getFromCache(key: string): T | undefined {
    this.stats.totalAccesses++;
    const cacheItem = this.cache.get(key);

    if (!cacheItem) {
      this.stats.misses++;

      return undefined;
    }

    // Проверяем, не истекло ли время жизни кеша
    if (Date.now() - cacheItem.createdAt > this.cacheExpiryTime) {
      this.cache.delete(key); // Удаляем "протухший" элемент из кеша
      this.stats.misses++;

      return undefined;
    }

    this.stats.hits++;

    return cacheItem.value;
  }

  getCacheStats(): CacheStats {
    return { ...this.stats };
  }

  prettyPrint(): void {
    const stats = this.getCacheStats();
    const hitRate = stats.totalAccesses > 0 ? ((stats.hits / stats.totalAccesses) * 100).toFixed(2) : 0;
    services.logger.debug(`Cache stats [${stats.totalAccesses}/${stats.hits}/${stats.misses}] Rate: ${hitRate}%`);
  }

  clearCache(): void {
    this.cache.clear();
  }

  resetCacheStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      totalAccesses: 0
    };
  }
}
