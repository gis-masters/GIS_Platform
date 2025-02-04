import { CrgLayer } from '../../gis/layers/layers.models';
import { geoserverLayerClient } from './geoserver-layer.client';
import { GeoserverLayerInfo } from './geoserver-layer.models';

export async function getLayerInfo(layer: CrgLayer): Promise<GeoserverLayerInfo> {
  return geoserverLayerClient.getLayerInfo(layer);
}
