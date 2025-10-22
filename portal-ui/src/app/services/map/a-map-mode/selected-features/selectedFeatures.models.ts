import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type MapSelectionTypes } from '../../map.models';

export interface SelectedFeaturesData {
  features: WfsFeature[];
  type?: MapSelectionTypes;
}
