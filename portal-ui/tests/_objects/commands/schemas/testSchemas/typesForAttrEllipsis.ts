import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const typesForAttrEllipsis: Schema = {
  name: 'typesForAttrEllipsis',
  title: 'Все типы данных для атрибутивки которые обрезаются оп ширине',
  readOnly: false,
  tableName: 'types_for_attr_ellipsis',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'field_string',
      title: 'Поле STRING',
      propertyType: PropertyType.STRING
    },
    {
      name: 'field_choice',
      title: 'Поле CHOICE',
      propertyType: PropertyType.CHOICE,
      options: [
        {
          title:
            'Модульная двухсторонняя тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая тестовая ',
          value: '1111'
        }
      ]
    },
    {
      name: 'field_url',
      title: 'Поле URL',
      propertyType: PropertyType.URL
    },
    {
      name: 'field_fias',
      title: 'Поле FIAS',
      propertyType: PropertyType.FIAS
    },
    {
      name: 'field_file',
      title: 'Поле FILE',
      propertyType: PropertyType.FILE
    },
    {
      name: 'field_document',
      title: 'Поле DOCUMENT',
      propertyType: PropertyType.DOCUMENT
    },
    {
      name: 'shape',
      title: 'Поле GEOMETRY',
      propertyType: PropertyType.GEOMETRY
    },
    ...systemProperties
  ]
};
