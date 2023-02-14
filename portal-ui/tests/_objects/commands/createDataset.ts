import { Given } from '@wdio/cucumber-framework';

import { createDataset, getDatasets } from '../../../src/app/services/data/data.service';
import { authenticateAsOwner } from './auth/authenticate';

declare const window: {
  createDataset: typeof createDataset;
  getDatasets: typeof getDatasets;
};

export async function createTestDataset(title: string): Promise<void> {
  await authenticateAsOwner();
  await browser.executeAsync(async (title, callback) => {
    const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });
    if (!datasets.length) {
      await window.createDataset({ title });
    }
    callback();
  }, title);
}

Given(/^существует набор данных "(.*)"$/, async (title: string) => {
  await createTestDataset(title);
});
