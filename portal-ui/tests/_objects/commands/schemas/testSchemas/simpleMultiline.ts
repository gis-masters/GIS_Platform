import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const simpleMultiLine: Schema = {
  name: 'simpleMultiLine',
  title: 'геометрия Мультилиния',
  tableName: 'simple_multi_line',
  styleName: 'generic',
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
