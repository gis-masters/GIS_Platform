import { environment } from '../../environment';
import { type FlagsList, keys, type ParsedFeatureFlagValue } from './feature-flags.models';

function lsKey(key: string) {
  return `crg-flag-${key}`;
}

class Flags implements FlagsList {
  private static _instance: Flags;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  allowProjectionsForAllLayers: ParsedFeatureFlagValue = '';
  oldPrintMechanism: ParsedFeatureFlagValue = '';
  openFileDownloadInSameTab: ParsedFeatureFlagValue = '';
  featureExtractPrintAutoMap: ParsedFeatureFlagValue = '';
  selectingFeaturesLimit: ParsedFeatureFlagValue = '';
  showDocumentRoles: ParsedFeatureFlagValue = '';

  private constructor() {
    this.init();
  }

  private init() {
    if (environment.flags) {
      Object.assign(this, environment.flags);
    }

    keys.forEach(key => {
      const stored = localStorage.getItem(lsKey(key));
      if (stored) {
        this[key] = JSON.parse(stored) as ParsedFeatureFlagValue;
      }
    });
  }

  set(flag: keyof FlagsList, value: ParsedFeatureFlagValue): string {
    if (!keys.includes(flag)) {
      throw new Error(`Нет такого флага "${flag}"`);
    }

    this[flag] = value;
    localStorage.setItem(lsKey(flag), JSON.stringify(value));

    return this.list;
  }

  get list(): string {
    return keys.map(key => `${key}: "${String(this[key])}"`).join(', ');
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
