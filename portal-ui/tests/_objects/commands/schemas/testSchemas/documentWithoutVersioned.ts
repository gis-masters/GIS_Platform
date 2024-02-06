import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const documentWithoutVersioned: Schema = {
  name: 'documents_without_versioned_schema',
  title: 'документы с простым контент типом без версионирования',
  readOnly: false,
  tableName: 'documents_without_versioned',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      properties: [{ name: 'title', title: 'Название', required: true, maxLength: 100 }],
      id: 'doc_v1',
      title: 'Тип 1',
      type: 'DOCUMENT'
    }
  ],
  properties: [
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
      hidden: true,
      propertyType: PropertyType.BOOL
    }
  ]
};
