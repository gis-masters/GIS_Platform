import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { getTestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createDatasetAs(title: string, username: string): Promise<Dataset> {
  return await requestAs(getTestUser(username), vectorDataClient.createDataset, { title });
}
