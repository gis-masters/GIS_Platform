import { getEnvironment } from './environment';

export interface FlagsList {
  sample: boolean;
}

const keys: (keyof FlagsList)[] = ['sample'];

function lsKey(key: string) {
  return `crg-flag-${key}`;
}

class Flags implements FlagsList {
  private static _instance: Flags;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  sample = false;

  private constructor() {
    void this.init();
  }

  private async init() {
    const { flags } = await getEnvironment();
    if (flags) {
      Object.assign(this, flags);
    }

    keys.forEach(key => {
      const stored = localStorage.getItem(lsKey(key));
      if (stored) {
        this[key] = JSON.parse(stored) as FlagsList[keyof FlagsList];
      }
    });
  }

  set<T extends keyof FlagsList>(flag: T, value: FlagsList[T]): string {
    if (!keys.includes(flag)) {
      throw new Error(`Нет такого флага "${flag}"`);
    }

    this[flag] = value;
    localStorage.setItem(lsKey(flag), JSON.stringify(value));

    return this.list;
  }

  get list(): string {
    return keys.map(key => `${key}: ${String(this[key])}`).join('\n');
  }

  reset() {
    keys.forEach(key => {
      localStorage.removeItem(lsKey(key));
      location.reload();
    });
  }
}

export const flags = Flags.instance;

Object.assign(window, { flags });
