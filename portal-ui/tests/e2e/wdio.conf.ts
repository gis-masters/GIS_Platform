import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';
import { getEnvironment } from '../_objects/commands/getEnvironment';

export const config: Options.Testrunner = {
  ...baseConfig,

  maxInstances: 1,

  specs: ['./**/*.feature'],

  async beforeStep() {
    await getEnvironment();
  },

  async afterScenario() {
    await browser.reloadSession();
  }
};
