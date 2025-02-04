import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const simpleMultiLineReadonly: Schema = {
  name: 'simpleMultiLineReadonly',
  title: 'геометрия Мультилиния Readonly',
  tableName: 'simple_multi_line_readonly',
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
  geometryType: GeometryType.MULTI_LINE_STRING
};
