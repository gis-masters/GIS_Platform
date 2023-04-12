import { CrgLayer } from '../../gis/layers/layers.models';
import { geoserverLayerClient } from './geoserverLayer.client';

import { GeoserverCoverage, GeoserverLayerInfo } from './geoserverLayer.models';

async function getGeoserverLayerInfo({ complexName, tableName }: CrgLayer): Promise<GeoserverLayerInfo> {
  const workspace = complexName.split(':')[0];

  const result = await geoserverLayerClient.getGeoserverLayerInfo(workspace, tableName);

  return result.layer;
}

export async function getLayerCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  const geoserverLayerInfo = await getGeoserverLayerInfo(layer);
  const result = await geoserverLayerClient.getGeoserverLayerCoverage(geoserverLayerInfo);

  return result.coverage;
}
