import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/schema.utils';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { VectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { requestAsAdmin } from '../requestAs';

export async function getVectorTable(datasetIdentifier: string, identifier: string): Promise<VectorTable> {
  const table = await requestAsAdmin(vectorDataClient.getVectorTable, datasetIdentifier, identifier);

  return {
    ...table,
    schema: convertOldToNewSchema(table.schema)
  };
}
