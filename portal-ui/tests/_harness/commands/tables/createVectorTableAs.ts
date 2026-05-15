import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/utils/convertOldToNewSchema';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { type NewVectorTable, type VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { type TestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createVectorTableAs(
  datasetIdentifier: string,
  newVectorTable: NewVectorTable,
  user: TestUser
): Promise<VectorTable> {
  const created = await requestAs(user, vectorDataClient.createVectorTable, datasetIdentifier, newVectorTable);

  return {
    ...created,
    schema: convertOldToNewSchema(created.schema)
  };
}
