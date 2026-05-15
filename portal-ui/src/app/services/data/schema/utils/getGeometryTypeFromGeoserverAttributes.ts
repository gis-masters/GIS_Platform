import { type Attribute } from '../../../geoserver/featureType/featureType.model';
import { GeometryType } from '../../../geoserver/wfs/wfs.models';

export function getGeometryTypeFromGeoserverAttributes(attributes: Attribute[] = []): GeometryType {
  const geometryAttribute = attributes.find(attribute => attribute.binding.includes('org.locationtech.jts.geom'));
  if (geometryAttribute) {
    if (geometryAttribute.binding.includes(GeometryType.LINE_STRING)) {
      return GeometryType.LINE_STRING;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_POLYGON)) {
      return GeometryType.MULTI_POLYGON;
    } else if (geometryAttribute.binding.includes(GeometryType.POLYGON)) {
      return GeometryType.POLYGON;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_POINT)) {
      return GeometryType.MULTI_POINT;
    } else if (geometryAttribute.binding.includes(GeometryType.POINT)) {
      return GeometryType.POINT;
    } else if (geometryAttribute.binding.includes(GeometryType.LINEAR_RING)) {
      return GeometryType.LINEAR_RING;
    } else if (geometryAttribute.binding.includes(GeometryType.GEOMETRY_COLLECTION)) {
      return GeometryType.GEOMETRY_COLLECTION;
    } else if (geometryAttribute.binding.includes(GeometryType.CIRCLE)) {
      return GeometryType.CIRCLE;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_LINE_STRING)) {
      return GeometryType.MULTI_LINE_STRING;
    }

    console.warn('Unknown geometry type:', geometryAttribute.binding, attributes);

    return GeometryType.MULTI_POLYGON;
  }

  const error = 'Not any attributes with geometry';
  console.error(error);
  throw new Error(error);
}
