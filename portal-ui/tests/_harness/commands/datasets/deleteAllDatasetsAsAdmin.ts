import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllDatasetsAsAdmin(): Promise<void> {
  const allDatasets = await requestAsAdmin(vectorDataClient.getAllDatasets);

  for (const dataset of allDatasets) {
    const tables = await requestAsAdmin(vectorDataClient.getAllVectorTablesInDataset, dataset.identifier);
    for (const table of tables) {
      await requestAsAdmin(vectorDataClient.deleteVectorTable, dataset.identifier, table.identifier);
    }
    await requestAsAdmin(vectorDataClient.deleteDataset, dataset.identifier);
  }
}
