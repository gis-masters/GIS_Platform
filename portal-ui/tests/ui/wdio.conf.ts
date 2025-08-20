import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';

declare global {
  var testOrganizationIndex: number | undefined;
}

if (!baseConfig.baseUrl) {
  throw new Error('Не указан baseUrl');
}

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: baseConfig.baseUrl + '/bl/',

  specs: ['./**/*.feature']
};
