import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { type Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { type TestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createDatasetAs(title: string, user: TestUser): Promise<Dataset> {
  return await requestAs(user, vectorDataClient.createDataset, { title });
}
