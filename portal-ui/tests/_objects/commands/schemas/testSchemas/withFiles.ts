import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const withFile: Schema = {
  name: 'documents_with_files_schema',
  title: 'документы с файлами',
  readOnly: false,
  tableName: 'documents_with_files',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      properties: [{ name: 'some_files', title: 'Поле FILE' }],
      id: 'doc_v1',
      title: 'Тип 1',
      type: 'DOCUMENT'
    }
  ],
  properties: [
    {
      name: 'some_files',
      title: 'Поле FILE',
      propertyType: PropertyType.FILE
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
