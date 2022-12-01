import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  specs: ['./tests/e2e/**/*.feature'],
  maxInstances: 1
};
