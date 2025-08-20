export interface CustomCacheConfig {
  maxAge?: number;
  disabled?: boolean;
  clear?: boolean;
}

interface StoreItem<T> {
  expires: number;
  payload: T;
}

const defaultConfig: CustomCacheConfig = {
  maxAge: 15 * 60 * 1000
};

const STALE_CHECK_DELAY = 10_000;

export class CustomCache<T = unknown> {
  private lastStaleCheck = 0;
  config: CustomCacheConfig;
  store: { [key: string]: StoreItem<T> } = {};

  constructor(config?: CustomCacheConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  match(key: string, config?: CustomCacheConfig): T | undefined {
    const { disabled }: CustomCacheConfig = { ...this.config, ...config };

    if (disabled) {
      return;
    }

    if (this.store[key] && !this.isItemStale(this.store[key], Date.now())) {
      return this.store[key].payload;
    }
  }

  add(key: string, payload: T, config: CustomCacheConfig = {}): void {
    const { disabled, maxAge = 0 }: CustomCacheConfig = { ...this.config, ...config };

    if (config.clear) {
      this.clear();

      return;
    }

    if (disabled) {
      return;
    }

    this.store[key] = {
      expires: Date.now() + maxAge,
      payload
    };

    this.checkForStale();
  }

  clear(): void {
    this.store = {};
  }

  private checkForStale() {
    const now = Date.now();

    if (now < this.lastStaleCheck + STALE_CHECK_DELAY) {
      return;
    }

    Object.keys(this.store).forEach(key => {
      if (this.isItemStale(this.store[key], now)) {
        delete this.store[key];
      }
    });

    this.lastStaleCheck = now;
  }

  private isItemStale(item: StoreItem<T>, now: number): boolean {
    return now > item.expires;
  }
}
