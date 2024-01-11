import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { requestAsAdmin } from '../requestAs';

export async function getVectorTableByTitle(datasetIdentifier: string, tableTitle: string): Promise<VectorTable> {
  const response = await requestAsAdmin(vectorDataClient.getVectorTables, datasetIdentifier, {
    page: 0,
    pageSize: 2,
    filter: { title: tableTitle }
  });

  const vectorTables: VectorTable[] = (response.content || []).map(table => ({
    ...table,
    dataset: datasetIdentifier
  }));

  if (vectorTables.length !== 1) {
    throw new Error('Ошибка получения векторной таблицы');
  }

  return vectorTables[0];
}
