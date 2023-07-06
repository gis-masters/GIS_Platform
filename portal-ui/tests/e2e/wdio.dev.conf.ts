import type { Options } from '@wdio/types';

import { getMyOfficeIp } from '../wdio.conf';
import { config as baseConfig } from './wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: `http://${getMyOfficeIp()}:4200`,

  specFileRetries: 0
};
