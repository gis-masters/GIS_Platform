import type { Options } from '@wdio/types';

import { config as baseConfig } from '../../wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: 'http://10.10.10.98',
  specs: ['./tests/deployment/stage98/**/*.feature']
};
