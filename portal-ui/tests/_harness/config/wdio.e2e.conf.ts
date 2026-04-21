import { addValueToPool, getValueFromPool, setResourcePool } from '@wdio/shared-store-service';
import type { Options } from '@wdio/types';

import { getEnvironment } from '../commands/getEnvironment';
import { addScenarioNameToJunit, junitReporterConfig, mergeJunitReports, prepareJunitReportingDir } from '../reporting/junitReporting';
import { baseConfig } from './wdio.base.conf';

declare global {
  // eslint-disable-next-line no-var
  var testOrganizationIndex: number | undefined;
}

export const config: WebdriverIO.Config = {
  ...baseConfig,

  specs: ['../../e2e/**/*.feature'],
  reporters: [
    'spec',
    ['junit', junitReporterConfig]
  ],

  onPrepare: async function (config: Options.Testrunner) {
    prepareJunitReportingDir();
    await setResourcePool('creatingOrganizationWorkerFree', [true]);

    const availableOrganizations = Array.from({ length: config.maxInstances || 1 }, (_, i) => i + 1);
    await setResourcePool('availableOrganizations', availableOrganizations);
  },

  before: async function () {
    const testOrganizationIndex: unknown = await getValueFromPool('availableOrganizations');
    if (typeof testOrganizationIndex !== 'number') {
      throw new TypeError(
        `Expected number from pool, got ${typeof testOrganizationIndex}: ${JSON.stringify(testOrganizationIndex)}`
      );
    }
    global.testOrganizationIndex = testOrganizationIndex;
    // eslint-disable-next-line no-console
    console.log(`Test organization index: ${testOrganizationIndex}`);
  },

  after: async function () {
    if (typeof global.testOrganizationIndex === 'number') {
      await addValueToPool('availableOrganizations', global.testOrganizationIndex);
    }
  },

  async beforeStep(_step, scenario) {
    addScenarioNameToJunit(scenario.name);
    await getEnvironment();
  },

  onComplete: function () {
    mergeJunitReports();
  }
};
