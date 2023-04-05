import {
  _getAllVectorTablesInDataset,
  _reqDeleteDataset,
  _reqDeleteVectorTable,
  _reqGetAllDatasets
} from '../../../../src/app/services/data/vectorData/vectorData.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllDatasetsAsAdmin(): Promise<void> {
  const allDatasets = await requestAsAdmin(_reqGetAllDatasets);

  for (const dataset of allDatasets) {
    const tables = await requestAsAdmin(_getAllVectorTablesInDataset, dataset.identifier);
    for (const table of tables) {
      await requestAsAdmin(_reqDeleteVectorTable, dataset.identifier, table.identifier);
    }
    await requestAsAdmin(_reqDeleteDataset, dataset.identifier);
  }
}
