import { CrgLayer } from '../../gis/layers/layers.models';
import { geoserverLayerClient } from './geoserverLayer.client';

import { GeoserverCoverage, GeoserverLayerInfo } from './geoserverLayer.models';
import { extractWorkspaceFromComplexName } from '../feature.util';

async function getGeoserverLayerInfo(layer: CrgLayer): Promise<GeoserverLayerInfo> {
  if (!layer.tableName || !layer.complexName) {
    throw new Error('Передан некорректный слой: ' + JSON.stringify(layer));
  }

  const workspace = extractWorkspaceFromComplexName(layer.complexName);

  const result = await geoserverLayerClient.getGeoserverLayerInfo(workspace, layer.tableName);

  return result.layer;
}

export async function getLayerCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  const geoserverLayerInfo = await getGeoserverLayerInfo(layer);
  const result = await geoserverLayerClient.getGeoserverLayerCoverage(geoserverLayerInfo);

  return result.coverage;
}
