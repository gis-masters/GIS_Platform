import { config as baseConfig } from './wdio.conf';

export const config: WebdriverIO.Config = {
  ...baseConfig,

  baseUrl: `http://localhost:4200`,
  hostname: undefined,
  port: undefined,
  path: undefined,
  maxInstances: 1,
  capabilities: [
    {
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
