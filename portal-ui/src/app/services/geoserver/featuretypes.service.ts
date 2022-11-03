import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { http } from '../http.service';
import { getGeoserverFeatureTypeInfoUrl } from '../server-urls.service';
import { CrgLayerType, CrgVectorLayer } from '../gis/projects.models';

export async function getFeatureType({
  complexName,
  dataset,
  dataStoreName,
  tableName,
  type
}: CrgVectorLayer): Promise<FeatureType> {
  const workspace = complexName.split(':')[0];
  const url = await getGeoserverFeatureTypeInfoUrl(
    workspace,
    type === CrgLayerType.VECTOR ? dataset : dataStoreName,
    tableName
  );
  let result = await http.get<{ featureType: FeatureType }>(url);

  try {
    await http.put(url, result, { params: { recalculate: 'nativebbox' } });
    result = await http.get<{ featureType: FeatureType }>(url, {});
  } catch {}

  return result.featureType;
}
