import { Given } from '@wdio/cucumber-framework';

import { parseFeatureFlagValue, setFeatureFlag } from '../commands/featureFlags/setFeatureFlag';

Given('установлен флаг {word} со значением {word}', async (flagName: string, valueWord: string) => {
  await setFeatureFlag(flagName, parseFeatureFlagValue(valueWord));
});
