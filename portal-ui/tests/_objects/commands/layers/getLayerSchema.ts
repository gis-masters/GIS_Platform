import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { CrgLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { getVectorTable } from '../tables/getVectorTable';

export async function getLayerSchema(layer: CrgLayer): Promise<Schema> {
  if (!layer.tableName || !layer.dataset) {
    throw new Error('Invalid layer');
  }

  const table = await getVectorTable(layer.dataset, layer.tableName);

  return table.schema;
}
