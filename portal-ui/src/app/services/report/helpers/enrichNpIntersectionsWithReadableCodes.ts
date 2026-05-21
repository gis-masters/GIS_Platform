import { applyView } from '../../data/schema/utils/applyView';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { type IntersectionPrintItem, type NpIntersectionPrintItem } from '../report.models';
import { readableIntersectionField } from './intersectionPrintReadableField';

const STATUS_ADM_FIELD = 'status_adm';

/**
 * Обогащает пересечения с границами НП: строка для DOCX из атрибута status_adm (поле `statusAdmReadable`).
 */
export async function enrichNpIntersectionsWithReadableCodes(
  items: IntersectionPrintItem[]
): Promise<NpIntersectionPrintItem[]> {
  const result: NpIntersectionPrintItem[] = [];

  for (const item of items) {
    const rawSchema = await getLayerSchema(item.layer);
    const properties = rawSchema ? applyView(rawSchema, item.layer.view).properties : undefined;

    result.push({
      ...item,
      statusAdmReadable: readableIntersectionField(item.feature.properties, STATUS_ADM_FIELD, properties)
    });
  }

  return result;
}
