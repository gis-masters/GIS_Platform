import { PropertyType, type Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const copyInvalidGeometry: Schema = {
  name: 'copy_invalid_geometry',
  title: 'для копирования с некорректной геометрией',
  tableName: 'copy_invalid_geometry',
  styleName: 'generic',
  properties: [
    {
      name: 'note',
      title: 'Примечание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    ...systemProperties
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
