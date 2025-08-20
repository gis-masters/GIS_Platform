import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const withViews: Schema = {
  name: 'withViews',
  title: 'С представлениями',
  readOnly: false,
  tableName: 'with_views',
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
      name: 'name',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'text',
      title: 'текст',
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
      propertyType: PropertyType.INT,
      description: ''
    },
    {
      name: 'status_adm',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: [
        {
          title: 'Модульная двухсторонняя',
          value: '1'
        }
      ]
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
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      type: 'VIEW',
      properties: [
        {
          name: 'name',
          title: 'Наименование объекта'
        }
      ]
    },
    {
      id: 'viewsId2',
      title: 'Представление 2',
      type: 'VIEW',
      properties: [
        {
          name: 'shape_area',
          title: 'Площадь, кв.м'
        }
      ]
    },
    {
      id: 'viewsId3',
      title: 'Представление 3',
      styleName: 'forest',
      type: 'VIEW',
      properties: [
        {
          name: 'classid',
          title: 'Значение объекта'
        },
        {
          name: 'name',
          title: 'Наименование'
        },
        {
          name: 'text',
          asTitle: true
        },
        {
          name: 'shape'
        },
        {
          name: 'shape_area'
        },
        {
          name: 'status_adm'
        },
        {
          name: 'ruleid'
        }
      ]
    },
    {
      id: 'viewsId4',
      title: 'Представление 4',
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
