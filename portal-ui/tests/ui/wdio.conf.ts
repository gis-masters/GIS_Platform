import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: baseConfig.baseUrl + '/bl/',

  specs: ['./tests/ui/**/*.feature']
};
