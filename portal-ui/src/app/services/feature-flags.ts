import { getEnvironment } from './environment';

export interface FlagsList {
  dataManagement: boolean;
}

const keys: (keyof FlagsList)[] = ['dataManagement'];

function lsKey(key: string) {
  return `crg-flag-${key}`;
}

class Flags implements FlagsList {
  private static _instance: Flags;
  dataManagement = false;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.init();
  }

  private async init() {
    const { flags } = await getEnvironment();
    if (flags) {
      Object.assign(this, flags);
    }

    keys.forEach(key => {
      const stored = localStorage.getItem(lsKey(key));
      if (stored) {
        this[key] = JSON.parse(stored);
      }
    });
  }

  set<T extends keyof FlagsList>(flag: T, value: FlagsList[T]) {
    if (!keys.includes(flag)) {
      throw new Error(`Нет такого флага "${flag}"`);
    }

    this[flag] = value;
    localStorage.setItem(lsKey(flag), JSON.stringify(value));
  }

  get list(): string {
    return keys.map(key => `${key}: ${this[key]}`).join('\n');
  }

  reset() {
    keys.forEach(key => {
      localStorage.removeItem(lsKey(key));
      location.reload();
    });
  }
}

export const flags = Flags.instance;

window['flags'] = flags;
