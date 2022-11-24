import type { Options } from '@wdio/types';

import { config as baseConfig } from '../../wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: 'http://10.10.10.58',
  specs: ['./tests/deployment/stage58/**/*.feature']
};
