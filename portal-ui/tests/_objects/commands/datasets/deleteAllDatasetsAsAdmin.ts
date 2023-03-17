import {
  deleteDataset,
  deleteVectorTable,
  getAllDatasets,
  getAllVectorTablesInDataset,
  getDatasets
} from '../../../../src/app/services/data/vectorData/vectorData.service';

import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  getDatasets: typeof getDatasets;
  getAllDatasets: typeof getAllDatasets;
  deleteVectorTable: typeof deleteVectorTable;
  getAllVectorTablesInDataset: typeof getAllVectorTablesInDataset;
  deleteDataset: typeof deleteDataset;
};

export async function deleteAllDatasetsAsAdmin(): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async callback => {
    const datasets = await window.getAllDatasets();
    if (datasets.length) {
      for (const dataset of datasets) {
        const tables = await window.getAllVectorTablesInDataset(dataset);

        if (tables.length) {
          for (const table of tables) {
            await window.deleteVectorTable(table);
          }
        }

        await window.deleteDataset(dataset);
      }
    }

    callback();
  });
}
