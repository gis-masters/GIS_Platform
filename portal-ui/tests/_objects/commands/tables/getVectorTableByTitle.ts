import { VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { getVectorTables } from '../../../../src/app/services/data/vectorData/vectorData.service';

declare const window: {
  getVectorTables: typeof getVectorTables;
};

export async function getVectorTableByTitle(datasetId: string, tableName: string): Promise<VectorTable> {
  const vectorTables: VectorTable[] = await browser.executeAsync(
    async (datasetId, tableName, callback) => {
      const [vectorTables] = await window.getVectorTables(datasetId, {
        page: 0,
        pageSize: 10,
        filter: { title: tableName }
      });

      callback(vectorTables);
    },
    datasetId,
    tableName
  );

  if (vectorTables.length !== 1) {
    throw new Error('Ошибка получения векторной таблицы');
  }

  return vectorTables[0];
}
