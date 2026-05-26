import { applyView } from '../../data/schema/utils/applyView';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { isVectorLayer } from '../../gis/layers/layers.typeguards';
import { type FzIntersectionPrintItem, type IntersectionPrintItem } from '../report.models';
import { readableIntersectionField } from './intersectionPrintReadableField';

/**
 * Обогащает список пересечений с ФЗ: classid/status в виде строк для шаблонов DOCX.
 */
export async function enrichFzIntersectionsWithReadableCodes(
  items: IntersectionPrintItem[]
): Promise<FzIntersectionPrintItem[]> {
  if (!items.length) {
    return [];
  }

  const firstLayer = items[0].layer;
  if (!isVectorLayer(firstLayer)) {
    return items.map(item => ({
      ...item,
      classidReadable: readableIntersectionField(item.feature.properties, 'classid'),
      statusReadable: readableIntersectionField(item.feature.properties, 'status')
    }));
  }

  const fzLayer = firstLayer;
  const rawSchema = await getLayerSchema(fzLayer);
  const properties = rawSchema ? applyView(rawSchema, fzLayer.view).properties : undefined;

  return items.map(item => ({
    ...item,
    classidReadable: readableIntersectionField(item.feature.properties, 'classid', properties),
    statusReadable: readableIntersectionField(item.feature.properties, 'status', properties)
  }));
}
