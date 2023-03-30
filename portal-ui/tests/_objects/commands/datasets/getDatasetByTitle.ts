import { Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { getDatasets } from '../../../../src/app/services/data/vectorData/vectorData.service';

declare const window: {
  getDatasets: typeof getDatasets;
};

export async function getDatasetByTitle(title: string): Promise<Dataset[]> {
  return await browser.executeAsync(async (title, callback) => {
    const [dataset] = await window.getDatasets({ page: 0, pageSize: 20, filter: { title } });

    callback(dataset);
  }, title);
}
