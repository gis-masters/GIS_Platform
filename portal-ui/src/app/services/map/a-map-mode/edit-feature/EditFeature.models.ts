import { Properties } from '../../../../components/edit-feature/edit-feature.component';
import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { CrgVectorableLayer } from '../../../gis/layers/layers.models';

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

export interface EditFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  layer?: CrgVectorableLayer;
  properties?: Properties;
  pristine?: boolean;
}
