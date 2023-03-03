import { Given } from '@wdio/cucumber-framework';

import {
  createDataset,
  createVectorTable,
  DataEntityType,
  getDatasets,
  getDatasetTables,
  VectorTable
} from '../../../src/app/services/data/data.service';
import { Role } from '../../../src/app/services/data/permissions.models';
import { authenticateAsOwner } from './auth/authenticate';
import { testSchemas } from './schemas/schema.templates';

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
        const table: VectorTable = {
          title,
          crs: 'EPSG:28407',
          schemaId,
          type: 'TABLE' as DataEntityType.TABLE,
          dataset: '',
          role: 'OWNER' as Role,
          identifier: ''
        };

        await window.createVectorTable(datasets[0], table);
      }

      callback();
    },
    title,
    schemaId
  );
}

Given(/^внутри набора данных существует таблица "(.*)" по схеме "(.*)"$/, async (title: string, schemaId: string) => {
  const schema = testSchemas[schemaId];
  if (!schema || !schema.name) {
    throw new Error(`Used unknown schema: '${title}'! Add it to tests schemas first.`);
  }

  await createTestVectorTable(title, schema.name);
});
