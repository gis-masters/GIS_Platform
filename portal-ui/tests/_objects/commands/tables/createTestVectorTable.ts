import { NewVectorTable, VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import {
  createDataset,
  createFeature,
  createVectorTable,
  getDatasets,
  getVectorTables
} from '../../../../src/app/services/data/vectorData/vectorData.service';
import { authenticateAs } from '../auth/authenticate';
import { getTestUser } from '../auth/testUsers';

declare const window: {
  createVectorTable: typeof createVectorTable;
  getVectorTables: typeof getVectorTables;
  getDatasets: typeof getDatasets;
  createDataset: typeof createDataset;
  createFeature: typeof createFeature;
};

export async function createVectorTableAs(
  datasetIdentifier: string,
  newVectorTable: NewVectorTable,
  username: string
): Promise<VectorTable> {
  await authenticateAs(getTestUser(username));

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
