import { Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { createDataset, getDatasets } from '../../../../src/app/services/data/vectorData/vectorData.service';
import { authenticateAs } from '../auth/authenticate';
import { testUsers } from '../auth/testUsers';

declare const window: {
  createDataset: typeof createDataset;
  getDatasets: typeof getDatasets;
};

export async function createDatasetAs(title: string, user: keyof typeof testUsers): Promise<Dataset> {
  await authenticateAs(testUsers[user]);

  return await _createDataset(title);
}

async function _createDataset(title: string): Promise<Dataset> {
  return await browser.executeAsync(async (title, callback) => {
    const dataset = await window.createDataset({ title });

    callback(dataset);
  }, title);
}
