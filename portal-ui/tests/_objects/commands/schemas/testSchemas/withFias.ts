import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const withFias: Schema = {
  name: 'documents_with_fias_schema',
  title: 'документы с fias',
  readOnly: false,
  tableName: 'documents_with_fias',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      id: 'doc_v1',
      title: 'Тип 1',
      type: 'DOCUMENT',
      properties: [
        {
          name: 'title',
          title: 'Название',
          required: true,
          maxLength: 100
        },
        {
          name: 'field_name'
        },
        {
          name: 'field_name__id'
        },
        {
          name: 'field_name__address'
        },
        {
          name: 'field_name__oktmo'
        }
      ]
    }
  ],
  properties: [
    {
      name: 'id',
      title: 'Идентификатор',
      propertyType: PropertyType.INT
    },
    {
      name: 'field_name',
      title: 'Адрес',
      propertyType: PropertyType.FIAS
    },
    {
      name: 'field_name__id',
      title: 'Адрес(id)',
      hidden: true,
      propertyType: PropertyType.INT
    },
    {
      name: 'field_name__address',
      title: 'Адрес(address)',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'field_name__oktmo',
      title: 'Адрес(oktmo)',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'title',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'path',
      title: 'Полный путь, отражающий иерархию объектов',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'created_at',
      title: 'Дата создания',
      hidden: true,
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'last_modified',
      title: 'Дата последней модификации',
      hidden: true,
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'created_by',
      title: 'Создатель',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'content_type_id',
      title: 'Идентификатор контент типа',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'is_folder',
      title: 'Раздел',
      hidden: false,
      propertyType: PropertyType.BOOL
    },
    {
      name: 'shape',
      title: 'Поле GEOMETRY',
      propertyType: PropertyType.GEOMETRY
    }
  ]
};
