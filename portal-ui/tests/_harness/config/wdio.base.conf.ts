import * as fs from 'node:fs';
import * as path from 'node:path';

import { type EnvironmentData } from '../../../src/app/services/environment';

declare global {
  const _environmentRaw: EnvironmentData;

  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>;
  }

  interface NodeListOf<TNode extends Node> extends NodeList {
    [Symbol.iterator](): IterableIterator<TNode>;
  }
}

export const baseConfig: WebdriverIO.Config = {
  hostname: '10.10.10.116',
  port: 4444,
  path: '/wd/hub',

  specs: [],
  exclude: [],

  maxInstances: 3,

  capabilities: [
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: ['--headless', 'window-size=1300,900']
      }
    }
  ],

  logLevel: 'error',
  bail: 0,
  baseUrl: 'http://10.10.10.62',
  waitforTimeout: 6000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  services: [
    [
      'visual',
      {
        baselineFolder: './tests/_screens/',
        formatImageName: '{tag}',
        screenshotPath: './tests/_screens/.tmp/',
        savePerInstance: true,
        autoSaveBaseline: true,
        blockOutStatusBar: true,
        blockOutToolBar: true,
        instanceName: 'desktop_chrome'
      }
    ],
    'shared-store'
  ],

  framework: 'cucumber',
  specFileRetries: 2,
  specFileRetriesDeferred: false,

  reporters: ['spec'],

  cucumberOpts: {
    require: ['./tests/_harness/**/*.ts'],
    backtrace: false,
    requireModule: [],
    failAmbiguousDefinitions: true,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: true,
    timeout: 240_000,
    ignoreUndefinedDefinitions: false
  },

  execArgv: ['--experimental-global-customevent'],

  afterStep: async function (step, scenario, result, _context) {
    if (!result.passed) {
      const errorDir = path.join(process.cwd(), 'tests/_screens/.tmp/errors');

      if (!fs.existsSync(errorDir)) {
        fs.mkdirSync(errorDir, { recursive: true });
      }

      const time = new Date().toISOString().split('T')[1].slice(0, 8).replaceAll(':', '-');
      const scenarioName = scenario.name.replaceAll(/[^\dA-Za-zА-я]/g, '_').slice(0, 30);
      const stepText = step.text.replaceAll(/[^\dA-Za-zА-я]/g, '_').slice(0, 30);
      const filename = `${time}_${scenarioName}_${stepText}.png`;
      const filepath = path.join(errorDir, filename);

      try {
        await browser.saveScreenshot(filepath);
        // eslint-disable-next-line no-console
        console.log(`\n📸 Скриншот ошибки сохранен: ${filepath}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`\n❌ Не удалось сохранить скриншот: ${String(error)}`);
      }
    }
  }
};
