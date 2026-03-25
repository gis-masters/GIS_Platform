import { type FlagsList, keys } from '../../../../src/app/services/common/feature-flags/feature-flags.models';

declare global {
  interface Window {
    flags: {
      set(flag: keyof FlagsList, value: string | number | boolean): string;
    };
  }
}

export function assertKeyofFlagsList(name: string): keyof FlagsList {
  for (const key of keys) {
    if (key === name) {
      return key;
    }
  }

  throw new Error(`Неизвестный флаг: "${name}"`);
}

export function parseFeatureFlagValue(raw: string): string | number | boolean {
  const t = raw.trim();
  if (t === 'true') {
    return true;
  }
  if (t === 'false') {
    return false;
  }
  if (/^-?\d+$/.test(t)) {
    return Number(t);
  }

  return t;
}

type SetFeatureFlagScriptArgs = [keyof FlagsList, string | number | boolean];

export async function setFeatureFlag(flagName: string, value: string | number | boolean): Promise<void> {
  const flag = assertKeyofFlagsList(flagName);
  await browser.execute<void, SetFeatureFlagScriptArgs>(
    (f, v) => {
      window.flags.set(f, v);
    },
    flag,
    value
  );
}
