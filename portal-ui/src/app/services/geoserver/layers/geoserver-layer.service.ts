import { type CrgLayer } from '../../gis/layers/layers.models';
import { geoserverLayerClient } from './geoserver-layer.client';
import { type GeoserverLayerInfo } from './geoserver-layer.models';

export async function getLayerInfo(layer: CrgLayer): Promise<GeoserverLayerInfo> {
  return geoserverLayerClient.getLayerInfo(layer);
}
