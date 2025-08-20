import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/schema.utils';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { NewVectorTable, VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { TestUser } from '../auth/testUsers';
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
