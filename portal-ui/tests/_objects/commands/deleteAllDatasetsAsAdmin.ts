import { Given } from '@wdio/cucumber-framework';

import {
  deleteDataset,
  deleteVectorTable,
  getAllDatasetTables,
  getDatasets
} from '../../../src/app/services/data/data.service';

import { authenticateAsAdmin } from './auth/authenticate';

declare const window: {
  getDatasets: typeof getDatasets;
  deleteVectorTable: typeof deleteVectorTable;
  getAllDatasetTables: typeof getAllDatasetTables;
  deleteDataset: typeof deleteDataset;
};

export async function deleteAllDatasetsAsAdmin(): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async callback => {
    const [datasets] = await window.getDatasets({ page: 0, pageSize: 20 });
    if (datasets.length) {
      datasets.forEach(async dataset => {
        const tables = await window.getAllDatasetTables(dataset);

        if (tables.length) {
          tables.forEach(async table => {
            await window.deleteVectorTable(table);
          });
        }

        await window.deleteDataset(dataset);
      });
    }

    callback();
  });
}

Given(/^все наборы данных удалены администратором$/, async () => {
  await deleteAllDatasetsAsAdmin();
});
