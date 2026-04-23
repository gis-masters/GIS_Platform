import { baseConfig } from './wdio.base.conf';

declare global {
  var testOrganizationIndex: number | undefined;
}

if (!baseConfig.baseUrl) {
  throw new Error('Не указан baseUrl');
}

export const config: WebdriverIO.Config = {
  ...baseConfig,

  baseUrl: baseConfig.baseUrl + '/bl/',

  specs: ['../../ui/**/*.feature']
};
