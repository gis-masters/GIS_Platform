import { setResourcePool, getValueFromPool, addValueToPool } from '@wdio/shared-store-service';
import type { Options } from '@wdio/types';

import { config as baseConfig } from '../wdio.conf';
import { getEnvironment } from '../_objects/commands/getEnvironment';

declare global {
  var testOrganizationIndex: number | undefined;
}

export const config: Options.Testrunner = {
  ...baseConfig,

  specs: ['./**/*.feature'],

  onPrepare: async function (config: Options.Testrunner) {
    await setResourcePool('creatingOrganizationWorkerFree', [true]);

    // array of ascending numbers from 1 to config.maxInstances
    const availableOrganizations = Array.from({ length: config.maxInstances || 1 }, (_, i) => i + 1);
    await setResourcePool('availableOrganizations', availableOrganizations);
  },

  before: async function () {
    const testOrganizationIndex = await getValueFromPool('availableOrganizations');
    global.testOrganizationIndex = testOrganizationIndex as number;
    console.log(`Test organization index: ${testOrganizationIndex}`);
  },

  after: async function () {
    if (typeof global.testOrganizationIndex === 'number') {
      await addValueToPool('availableOrganizations', global.testOrganizationIndex);
    }
  },

  async beforeStep() {
    await getEnvironment();
  }
};
