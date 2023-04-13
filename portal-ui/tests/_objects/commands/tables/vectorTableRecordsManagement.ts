import { NewWfsFeature, WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { requestAs } from '../requestAs';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { getTestUser } from '../auth/testUsers';

export async function createRecordAs(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  feature: NewWfsFeature,
  username: string
): Promise<WfsFeature> {
  return await requestAs(
    getTestUser(username),
    vectorDataClient.createFeature.bind(vectorDataClient),
    datasetIdentifier,
    vectorTableIdentifier,
    feature
  );
}
