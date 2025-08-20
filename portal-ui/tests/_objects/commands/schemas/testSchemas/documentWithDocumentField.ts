import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const documentWithDocumentField: Schema = {
  name: 'documents_with_document_field_schema',
  title: 'документы с полем документ',
  readOnly: false,
  tableName: 'documents_with_document_field',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      properties: [{ name: 'title' }, { name: 'documents' }],
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
      name: 'documents',
      title: 'Документы',
      propertyType: PropertyType.DOCUMENT
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
