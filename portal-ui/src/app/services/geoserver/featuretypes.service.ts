import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { http } from '../api/http.service';
import { getGeoserverFeatureTypeInfoUrl } from '../api/server-urls.service';
import { CrgLayer, CrgLayerType } from '../gis/layers/layers.models';

export async function getFeatureType({
  complexName,
  dataset,
  dataStoreName,
  tableName,
  type
}: CrgLayer): Promise<FeatureType> {
  const workspace = complexName.split(':')[0];
  const url = getGeoserverFeatureTypeInfoUrl(
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
