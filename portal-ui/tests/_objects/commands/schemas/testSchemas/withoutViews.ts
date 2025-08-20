import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const withoutViews: Schema = {
  name: 'withoutViews',
  title: 'Без представлений',
  readOnly: false,
  tableName: 'without_views',
  styleName: 'admemo',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      propertyType: PropertyType.CHOICE,
      options: [
        { title: 'first', value: '1' },
        { title: 'second', value: '2' }
      ]
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'name',
      title: 'Наименование объекта',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape_area',
      title: 'Площадь, кв.м',
      propertyType: PropertyType.FLOAT
    },
    {
      name: 'status_adm',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: [{ title: 'Модульная двухсторонняя', value: '1' }]
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    },
    ...systemProperties
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
