import {
  type FlagsList,
  keys,
  type ParsedFeatureFlagValue
} from '../../../../src/app/services/common/feature-flags/feature-flags.models';

declare global {
  interface Window {
    flags: {
      set(flag: keyof FlagsList, value: ParsedFeatureFlagValue): string;
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

export function parseFeatureFlagValue(raw: string): ParsedFeatureFlagValue {
  const t = raw.trim();
  let result: ParsedFeatureFlagValue;

  if (t === 'true') {
    result = true;
  } else if (t === 'false') {
    result = false;
  } else if (/^-?\d+$/.test(t)) {
    result = Number(t);
  } else {
    result = t;
  }

  return result;
}

type SetFeatureFlagScriptArgs = [keyof FlagsList, ParsedFeatureFlagValue];

export async function setFeatureFlag(flagName: string, value: ParsedFeatureFlagValue): Promise<void> {
  const flag = assertKeyofFlagsList(flagName);
  await browser.execute<void, SetFeatureFlagScriptArgs>(
    (f, v) => {
      window.flags.set(f, v);
    },
    flag,
    value
  );
}
