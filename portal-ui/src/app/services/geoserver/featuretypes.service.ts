import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { http } from '../api/http.service';
import { CrgLayer } from '../gis/layers/layers.models';
import { getGeoserverFeatureTypeInfoUrl } from '../api/server-urls.service';
import { extractFeatureTypeNameFromComplexName, extractWorkspaceFromComplexName } from './feature.util';

export async function getFeatureType(layer: CrgLayer): Promise<FeatureType> {
  const result = await http.get<{ featureType: FeatureType }>(buildFeatureTypeUrl(layer));

  return result.featureType;
}

export async function recalculateBboxAndGetFeatureType(layer: CrgLayer): Promise<FeatureType> {
  const featureType = getFeatureType(layer);

  let result: { featureType: FeatureType };
  try {
    const url = buildFeatureTypeUrl(layer);

    await http.put(url, { featureType: featureType }, { params: { recalculate: 'nativebbox' } });
    result = await http.get<{ featureType: FeatureType }>(url, {});
  } catch {}

  return result.featureType;
}

function buildFeatureTypeUrl(layer: CrgLayer) {
  const workspace = extractWorkspaceFromComplexName(layer.complexName);
  const featureTypeName = extractFeatureTypeNameFromComplexName(layer.complexName);
  const datastore = layer.dataset;
  if (!datastore) {
    throw new Error(`У слоя: '${layer.complexName}' не указан dataset`);
  }

  return getGeoserverFeatureTypeInfoUrl(workspace, datastore, featureTypeName);
}
