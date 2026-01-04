import { config as baseConfig } from '../wdio.conf';

declare global {
  // eslint-disable-next-line no-var
  var testOrganizationIndex: number | undefined;
}

if (!baseConfig.baseUrl) {
  throw new Error('Не указан baseUrl');
}

export const config: WebdriverIO.Config = {
  ...baseConfig,

  baseUrl: baseConfig.baseUrl + '/bl/',

  specs: ['./**/*.feature']
};
