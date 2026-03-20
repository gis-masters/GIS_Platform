import { When } from '@wdio/cucumber-framework';

import { sleep } from '../../../src/app/services/util/sleep';

When(/^жду (\d*) мс/, async timeout => {
  await sleep(Number(timeout));
});
