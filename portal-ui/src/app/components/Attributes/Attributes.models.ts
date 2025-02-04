import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';

export interface AttributesTableRecord extends Record<string, unknown> {
  cutId: number;
  feature: WfsFeature;
}

export const FILTER_BY_SELECTION = 'filterBySelection';
