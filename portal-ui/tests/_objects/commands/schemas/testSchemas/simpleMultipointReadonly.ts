import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const simpleMultiPointReadonly: Schema = {
  name: 'simpleMultiPointReadonly',
  title: 'геометрия Мультиточка Readonly',
  tableName: 'simple_multi_point_readonly',
  styleName: 'generic',
  readOnly: true,
  properties: [
    {
      name: 'name',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    ...systemProperties
  ],
  geometryType: GeometryType.MULTI_POINT
};
