import { NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { geometryValidationClient } from './geometryValidation.client';

export async function makeGeometryValid(feature: NewWfsFeature): Promise<WfsFeature> {
  return await geometryValidationClient.makeGeometryValid(feature);
}
