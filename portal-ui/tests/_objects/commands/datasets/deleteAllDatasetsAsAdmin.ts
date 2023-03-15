import {
  deleteDataset,
  deleteVectorTable,
  getAllDatasets,
  getAllDatasetTables,
  getDatasets
} from '../../../../src/app/services/data/data.service';

import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  getDatasets: typeof getDatasets;
  getAllDatasets: typeof getAllDatasets;
  deleteVectorTable: typeof deleteVectorTable;
  getAllDatasetTables: typeof getAllDatasetTables;
  deleteDataset: typeof deleteDataset;
};

export async function deleteAllDatasetsAsAdmin(): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async callback => {
    const datasets = await window.getAllDatasets();
    if (datasets.length) {
      for (const dataset of datasets) {
        const tables = await window.getAllDatasetTables(dataset);

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
