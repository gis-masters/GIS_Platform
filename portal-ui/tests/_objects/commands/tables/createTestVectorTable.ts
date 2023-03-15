import {
  createDataset,
  createVectorTable,
  createVectorTableRecord,
  getDatasets,
  getDatasetTables,
  NewVectorTable,
  VectorTable
} from '../../../../src/app/services/data/data.service';
import { testUsers } from '../auth/testUsers';
import { authenticateAs } from '../auth/authenticate';

declare const window: {
  createVectorTable: typeof createVectorTable;
  getDatasetTables: typeof getDatasetTables;
  getDatasets: typeof getDatasets;
  createDataset: typeof createDataset;
  createVectorTableRecord: typeof createVectorTableRecord;
};

export async function createVectorTableAs(
  datasetIdentifier: string,
  newVectorTable: NewVectorTable,
  user: keyof typeof testUsers
): Promise<VectorTable> {
  await authenticateAs(testUsers[user]);

  return await _createVectorTable(datasetIdentifier, newVectorTable);
}

async function _createVectorTable(datasetIdentifier: string, newVectorTable: NewVectorTable): Promise<VectorTable> {
  return await browser.executeAsync(
    async (datasetIdentifier, newVectorTable, callback) => {
      const vectorTable = await window.createVectorTable(datasetIdentifier, newVectorTable);

      callback(vectorTable);
    },
    datasetIdentifier,
    newVectorTable
  );
}
