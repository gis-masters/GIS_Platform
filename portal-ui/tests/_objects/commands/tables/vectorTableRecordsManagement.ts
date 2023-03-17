import { NewWfsFeature, WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { createFeature } from '../../../../src/app/services/data/vectorData/vectorData.service';

declare const window: {
  createFeature: typeof createFeature;
};

export async function createRecord(
  datasetId: string,
  vectorTableId: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  return await browser.executeAsync(
    async (datasetId, vectorTableId, feature, callback) => {
      const record = await window.createFeature(datasetId, vectorTableId, feature);

      callback(record);
    },
    datasetId,
    vectorTableId,
    feature
  );
}
