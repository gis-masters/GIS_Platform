import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { MapSelectionTypes } from '../../map.models';

export interface SelectedFeaturesData {
  features: WfsFeature[];
  type?: MapSelectionTypes;
}
