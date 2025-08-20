import type { Options } from '@wdio/types';

import { config as baseConfig } from './wdio.conf';

export const config: Options.Testrunner = {
  ...baseConfig,

  baseUrl: `http://localhost:4200`,
  hostname: undefined,
  port: undefined,
  path: undefined,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      acceptInsecureCerts: true,
      setWindowRect: true,
      'goog:chromeOptions': {
        args: ['window-size=1300,900']
      }
    }
  ],

  specFileRetries: 0,

  async beforeScenario() {
    await browser.url('http://localhost:4200/test-data-preparation');
  }
};
