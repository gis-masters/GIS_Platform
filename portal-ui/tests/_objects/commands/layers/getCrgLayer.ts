import { CrgLayer, CrgLayerType } from '../../../../src/app/services/gis/projects/projects.models';

import { getVectorTableByTitle } from '../tables/getVectorTableByTitle';
import { getSchema } from '../schemas/getSchema';

export async function getCrgLayer(
  layerTitle: string,
  tableTitle: string,
  latestDatasetId: string,
  enabled: string,
  viewId?: string
): Promise<CrgLayer> {
  const vectorTable = await getVectorTableByTitle(latestDatasetId, tableTitle);
  const schema = await getSchema(vectorTable.schemaId);

  const layer = {
    type: 'vector' as CrgLayerType,
    dataset: latestDatasetId,
    tableName: vectorTable.identifier,
    title: layerTitle,
    nativeCRS: vectorTable.crs,
    schemaId: vectorTable.schemaId,
    styleName: schema.styleName,
    enabled: enabled === 'включенный'
  };

  return viewId
    ? {
        ...layer,
        view: viewId
      }
    : layer;
}
