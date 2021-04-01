import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { getGeoserverFeatureTypeInfoUrl } from '../server-urls.service';
import { CrgLayer } from '../crg/projects.models';
import { http } from '../http.service';

export async function getFeatureType({ complexName, dataset, tableName }: CrgLayer): Promise<FeatureType> {
  const workspace = complexName.split(':')[0];
  const url = await getGeoserverFeatureTypeInfoUrl(workspace, dataset, tableName);
  let result = await http.get<{ featureType: FeatureType }>(url);

  try {
    await http.put(url, result, { params: { recalculate: 'nativebbox' } });
    result = await http.get<{ featureType: FeatureType }>(url, {});
  } catch (e) {}

  return result.featureType;
}
