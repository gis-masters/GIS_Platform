import { requestAsAdmin } from '../requestAs';
import { NewWfsFeature, WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';

export async function createRecordAsAdmin(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  return await requestAsAdmin(vectorDataClient.createFeature, datasetIdentifier, vectorTableIdentifier, feature);
}
