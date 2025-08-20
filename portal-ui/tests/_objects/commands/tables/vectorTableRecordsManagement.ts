import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { NewWfsFeature, WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { requestAsAdmin } from '../requestAs';

export async function createRecordAsAdmin(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  return await requestAsAdmin(vectorDataClient.createFeature, datasetIdentifier, vectorTableIdentifier, feature);
}
