import { Given } from '@wdio/cucumber-framework';

import { createVectorTableRecord, getDatasets, getDatasetTables } from '../../../src/app/services/data/data.service';
import { GeometryType, WfsFeature } from '../../../src/app/services/geoserver/wfs.models';

import { authenticateAsAdmin } from './auth/authenticate';

declare const window: {
  getDatasetTables: typeof getDatasetTables;
  getDatasets: typeof getDatasets;
  createVectorTableRecord: typeof createVectorTableRecord;
};

export async function createNewObjectInLayerAsAdmin(tableTitle: string, datasetTitle: string): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(
    async (tableTitle, datasetTitle, callback) => {
      const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });

      const dataset = datasets.find(dateset => dateset.title === datasetTitle);

      if (!dataset) {
        return;
      }
      const [vectorTables] = await window.getDatasetTables(dataset.identifier, { page: 0, pageSize: 10 });
      const vectorTable = vectorTables.find(item => item.title === tableTitle);

      if (!vectorTable) {
        return;
      }

      const feature = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon' as GeometryType.MULTI_POLYGON,
          coordinates: [
            [
              [
                [7_095_661, 5_060_183],
                [7_102_216, 5_044_724],
                [7_078_788, 5_049_480],
                [7_095_661, 5_060_183]
              ]
            ]
          ]
        },
        properties: {}
      };

      await window.createVectorTableRecord(dataset.identifier, vectorTable.identifier, feature as WfsFeature);
      callback();
    },
    tableTitle,
    datasetTitle
  );
}

Given(
  /^по таблице "(.*)" набора данных "(.*)" создан новый объект в слое$/,
  async (tableTitle: string, datasetTitle: string) => {
    await createNewObjectInLayerAsAdmin(tableTitle, datasetTitle);
  }
);
