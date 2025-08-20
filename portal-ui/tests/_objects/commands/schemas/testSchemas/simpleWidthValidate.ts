import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const simpleDocumentsWidthPattern: Schema = {
  name: 'simple_documents_width_pattern',
  title: 'документы с валидацией по паттерну',
  readOnly: false,
  tableName: 'simple_documents_width_pattern',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      properties: [{ name: 'title' }, { name: 'description' }],
      id: 'doc_v1',
      title: 'Тип 1',
      type: 'DOCUMENT'
    }
  ],
  properties: [
    {
      name: 'title',
      title: 'Название',
      regex: '^[0-9]{2}:[0-9]{2}:[0-9]{6}:[0-9]{1,5}$',
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание',
      regex: '^[0-9]{2}:[0-9]{2}:[0-9]{6}:[0-9]{1,5}$',
      regexErrorMessage: 'Значение не соответствует паттерну',
      propertyType: PropertyType.STRING
    },
    {
      name: 'path',
      title: 'Полный путь, отражающий иерархию обьектов',
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
      hidden: true,
      propertyType: PropertyType.BOOL
    }
  ]
};
