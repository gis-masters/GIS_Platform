import { CoordinateEdited } from '../../geoserver/wfs/wfs.models';
import { isStringNumberArray } from './isStringNumberArray';

export function isCoordinateEdited(value: unknown): value is CoordinateEdited {
  return isStringNumberArray(value);
}
