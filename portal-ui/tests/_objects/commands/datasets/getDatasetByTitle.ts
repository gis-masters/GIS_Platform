import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { requestAsAdmin } from '../requestAs';

export async function getDatasetByTitle(title: string): Promise<Dataset> {
  const response = await requestAsAdmin(vectorDataClient.getDatasets, {
    page: 0,
    pageSize: 1,
    filter: { title }
  });
  const dataset = response?.content[0];

  if (response.page.totalElements !== 1 || !dataset) {
    throw new Error(`Ошибка получения набора данных "${title}"`);
  }

  return dataset;
}
