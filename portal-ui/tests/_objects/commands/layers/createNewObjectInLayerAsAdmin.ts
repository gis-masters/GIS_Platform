import {
  createFeature,
  getDatasets,
  getVectorTables
} from '../../../../src/app/services/data/vectorData/vectorData.service';
import { GeometryType, WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { authenticateAsAdmin } from './../auth/authenticate';

declare const window: {
  getVectorTables: typeof getVectorTables;
  getDatasets: typeof getDatasets;
  createFeature: typeof createFeature;
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
      const [vectorTables] = await window.getVectorTables(dataset.identifier, { page: 0, pageSize: 10 });
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

      await window.createFeature(dataset.identifier, vectorTable.identifier, feature as WfsFeature);
      callback();
    },
    tableTitle,
    datasetTitle
  );
}
