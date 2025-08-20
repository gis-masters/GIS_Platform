import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const allTypes: Schema = {
  name: 'allTypes',
  title: 'Все типы данных',
  readOnly: false,
  tableName: 'all_types',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'field_int',
      title: 'Поле INT',
      propertyType: PropertyType.INT
    },
    {
      name: 'field_double',
      title: 'Поле FLOAT',
      propertyType: PropertyType.FLOAT
    },
    {
      name: 'field_string',
      title: 'Поле STRING',
      propertyType: PropertyType.STRING
    },
    {
      name: 'field_date',
      title: 'Поле DATETIME',
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'field_boolean',
      title: 'Поле BOOL',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'field_choice',
      title: 'Поле CHOICE',
      propertyType: PropertyType.CHOICE,
      options: [
        {
          title: 'Модульная двухсторонняя',
          value: '1111'
        },
        {
          title: 'Модульная односторонняя',
          value: '1122'
        },
        {
          title: 'Отдельно стоящий короб',
          value: '55'
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
      name: 'field_fias__oktmo',
      title: 'Поле FIAS oktmo',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'field_fias__address',
      title: 'Поле FIAS address',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'ruleid',
      title: 'ruleid',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'field_fias__id',
      title: 'Поле FIAS id',
      hidden: true,
      propertyType: PropertyType.INT
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
    {
      name: 'field_uuid',
      title: 'Поле UUID',
      hidden: true,
      propertyType: PropertyType.UUID
    },
    {
      name: 'field_user_id',
      title: 'Поле USER_ID',
      propertyType: PropertyType.USER_ID
    },
    {
      name: 'field_user',
      title: 'Поле USER',
      multiple: true,
      propertyType: PropertyType.USER
    },
    ...systemProperties
  ]
};
