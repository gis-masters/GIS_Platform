import { convertNewToOldSchema } from '../../../../src/app/services/data/schema/utils/convertNewToOldSchema';
import { vectorDataClient } from '../../../../src/app/services/data/vectorData/vectorData.client';
import { type NewWfsFeature, type WfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { requestAsAdmin } from '../requestAs';
import { getVectorTable } from './getVectorTable';

export async function createRecordsAsAdmin(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  features: NewWfsFeature[]
): Promise<WfsFeature[]> {
  const table = await getVectorTable(datasetIdentifier, vectorTableIdentifier);
  const schema = table.schema;
  const wasReadOnly = Boolean(schema.readOnly);

  if (wasReadOnly) {
    await requestAsAdmin(
      vectorDataClient.updateVectorTableSchema,
      datasetIdentifier,
      vectorTableIdentifier,
      convertNewToOldSchema({ ...schema, readOnly: false })
    );
  }

  try {
    const created: WfsFeature[] = [];

    for (const feature of features) {
      created.push(
        await requestAsAdmin(vectorDataClient.createFeature, datasetIdentifier, vectorTableIdentifier, feature)
      );
    }

    return created;
  } finally {
    if (wasReadOnly) {
      await requestAsAdmin(
        vectorDataClient.updateVectorTableSchema,
        datasetIdentifier,
        vectorTableIdentifier,
        convertNewToOldSchema({ ...schema, readOnly: true })
      );
    }
  }
}
