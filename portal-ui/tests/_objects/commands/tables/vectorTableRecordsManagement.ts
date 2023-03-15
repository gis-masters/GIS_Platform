import { NewWfsFeature, WfsFeature } from '../../../../src/app/services/geoserver/wfs.models';
import { createVectorTableRecord } from '../../../../src/app/services/data/data.service';

declare const window: {
  createVectorTableRecord: typeof createVectorTableRecord;
};

export async function createRecord(
  datasetId: string,
  vectorTableId: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  return await browser.executeAsync(
    async (datasetId, vectorTableId, feature, callback) => {
      const record = await window.createVectorTableRecord(datasetId, vectorTableId, feature);

      callback(record);
    },
    datasetId,
    vectorTableId,
    feature
  );
}
