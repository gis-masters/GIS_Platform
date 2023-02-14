import { Given } from '@wdio/cucumber-framework';

import { getDatasets, getDatasetTables } from '../../../src/app/services/data/data.service';
import { authenticateAsOwner } from './auth/authenticate';

declare const window: {
  getDatasetTables: typeof getDatasetTables;
  getDatasets: typeof getDatasets;
};

async function selectVectorTable(tableTitle: string, datasetTitle: string): Promise<string> {
  await authenticateAsOwner();

  return await browser.executeAsync(
    async (tableTitle, datasetTitle, callback) => {
      const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });
      const dataset = datasets.find(item => item.title === datasetTitle);

      const [vectorTables] = await window.getDatasetTables(dataset.identifier, { page: 0, pageSize: 10 });
      const vectorTable = vectorTables.find(item => item.title === tableTitle);

      const url = `/data-management?path_dm=%5B"r","root","dr","datasetRoot","dataset","${dataset.identifier}","table","${vectorTable.identifier}"%5D&opts_dm=%5B0,10,"created_at","desc",%7B%7D%5D`;
      callback(url);
    },
    tableTitle,
    datasetTitle
  );
}

async function goToSelectedVectorTable(tableTitle: string, datasetTitle: string): Promise<void> {
  const url = await selectVectorTable(tableTitle, datasetTitle);
  await browser.url(url);
}

Given(
  /^я перешел на страницу векторной таблицы "(.*)" в наборе данных "(.*)" и выбрал её$/,
  async (tableTitle: string, datasetTitle: string) => {
    await goToSelectedVectorTable(tableTitle, datasetTitle);
  }
);
