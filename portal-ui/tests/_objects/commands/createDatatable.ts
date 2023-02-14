import { Given } from '@wdio/cucumber-framework';

import {
  createDataset,
  createVectorTable,
  getDatasets,
  getDatasetTables,
  VectorTable
} from '../../../src/app/services/data/data.service';
import { authenticateAsOwner } from './auth/authenticate';

declare const window: {
  createVectorTable: typeof createVectorTable;
  getDatasetTables: typeof getDatasetTables;
  getDatasets: typeof getDatasets;
  createDataset: typeof createDataset;
};

export async function createTestVectorTable(title: string, schemaId: string): Promise<void> {
  await authenticateAsOwner();
  await browser.executeAsync(
    async (title, schemaId, callback) => {
      const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });
      const [vectorTables] = await window.getDatasetTables(String(datasets[0].identifier), {
        page: 0,
        pageSize: 10,
        filter: { title: title }
      });

      if (!vectorTables.length) {
        const table1: VectorTable = {
          title,
          crs: 'EPSG:28407',
          schemaId,
          type: undefined,
          dataset: undefined,
          role: undefined,
          identifier: undefined
        };

        await window.createVectorTable(datasets[0], table1);
      }

      callback();
    },
    title,
    schemaId
  );
}

Given(/^внутри набора данных существует таблица "(.*)" по схеме "(.*)"$/, async (title: string, schemaId: string) => {
  await createTestVectorTable(title, schemaId);
});
