import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forTestTitles: Schema = {
  name: 'forTestTitles',
  title: 'С заголовками объектов',
  readOnly: false,
  tableName: 'for_test_titles',
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
      name: 'text',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      propertyType: PropertyType.INT
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
    }
  ],
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      styleName: 'forest',
      type: 'VIEW',
      properties: [
        {
          name: 'classid'
        },
        {
          name: 'shape'
        },
        {
          name: 'shape_area',
          asTitle: true
        },
        {
          name: 'status_adm'
        },
        {
          name: 'ruleid'
        }
      ]
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
