import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  maxInstances: 1,

  specs: ['./**/*.feature'],

  afterScenario: async function () {
    await browser.reloadSession();
  }
};
