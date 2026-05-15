import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/utils/convertOldToNewSchema';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { type VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { requestAsAdmin } from '../requestAs';

export async function getVectorTableInDatasetByTitle(
  datasetIdentifier: string,
  tableTitle: string
): Promise<VectorTable> {
  const response = await requestAsAdmin(vectorDataClient.getVectorTablesInDataset, datasetIdentifier, {
    page: 0,
    pageSize: 2,
    filter: { title: tableTitle }
  });

  const vectorTables: VectorTable[] = (response.content || []).map(table => ({
    ...table,
    schema: convertOldToNewSchema(table.schema)
  }));

  if (vectorTables.length !== 1) {
    throw new Error('Ошибка получения векторной таблицы');
  }

  return vectorTables[0];
}
