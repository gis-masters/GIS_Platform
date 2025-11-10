import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';

export interface EditFeatureInfo {
  layerName: string;
  feature: WfsFeature;
  isReadOnly: boolean;
}
