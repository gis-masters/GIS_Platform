import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const simplePointDifferentStyle: Schema = {
  name: 'simplePointDifferentStyle',
  title: 'Простая Точка стиль треугольника',
  tableName: 'simple_point',
  styleName: 'simple_point_3',
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
  geometryType: GeometryType.POINT
};
