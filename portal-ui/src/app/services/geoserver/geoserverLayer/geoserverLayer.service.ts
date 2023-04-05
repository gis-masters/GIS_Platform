import { CrgLayer } from '../../gis/layers/layers.models';
import { _reqGetGeoserverLayerCoverage, _reqGetGeoserverLayerInfo } from './geoserverLayer.client';

import { GeoserverCoverage, GeoserverLayerInfo } from './geoserverLayer.models';

async function getGeoserverLayerInfo({ complexName, tableName }: CrgLayer): Promise<GeoserverLayerInfo> {
  const workspace = complexName.split(':')[0];

  const result = await _reqGetGeoserverLayerInfo(workspace, tableName);

  return result.layer;
}

export async function getLayerCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  const geoserverLayerInfo = await getGeoserverLayerInfo(layer);
  const result = await _reqGetGeoserverLayerCoverage(geoserverLayerInfo);

  return result.coverage;
}
