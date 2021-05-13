export interface CustomCacheConfig {
  maxAge?: number;
  disabled?: boolean;
}

interface StoreItem<T> {
  expires: number;
  payload: T;
}

const defaultConfig: CustomCacheConfig = {
  maxAge: 15 * 60 * 1000
};

const STALE_CHECK_DELAY = 10000;

export class CustomCache<T = unknown> {
  private lastStaleCheck = 0;
  config: CustomCacheConfig;
  store: { [key: string]: StoreItem<T> } = {};

  constructor(config?: CustomCacheConfig) {
    this.config = { ...defaultConfig, ...(config || {}) };
  }

  match(key: string): T | undefined {
    if (this.store[key] && !this.isItemStale(this.store[key], new Date().getTime())) {
      return this.store[key].payload;
    }
  }

  add(key: string, payload: T, config: CustomCacheConfig = {}) {
    const { disabled, maxAge }: CustomCacheConfig = { ...this.config, ...config };

    if (disabled) {
      return;
    }

    this.store[key] = {
      expires: new Date().getTime() + maxAge,
      payload
    };

    this.checkForStale();
  }

  clear() {
    this.store = {};
  }

  private checkForStale() {
    const now = new Date().getTime();

    if (now < this.lastStaleCheck + STALE_CHECK_DELAY) {
      return;
    }

    Object.keys(this.store).forEach(key => {
      if (this.isItemStale(this.store[key], now)) {
        delete this.store[key];
      }
    });
  }

  private isItemStale(item: StoreItem<T>, now: number): boolean {
    return now > item.expires;
  }
}
