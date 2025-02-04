import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const dlDataWithSimpleContentType: Schema = {
  name: 'dl_data_documents_with_simple_content_type_schema',
  title: 'документы с простым контент типом в новой библиотеке',
  tableName: 'dl_data_documents_with_simple_content_type',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  contentTypes: [
    {
      properties: [{ name: 'title', title: 'Название', required: true, maxLength: 100 }],
      id: 'doc_v1',
      title: 'Тип 1',
      type: 'DOCUMENT'
    },
    {
      id: 'doc_v2',
      title: 'Тип 2',
      type: 'DOCUMENT',
      properties: [
        {
          name: 'title',
          title: 'Название',
          required: true
        },
        {
          name: 'some_files',
          title: 'Поле FILE',
          propertyType: PropertyType.FILE
        }
      ]
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
      name: 'shape',
      title: 'Поле GEOMETRY',
      propertyType: PropertyType.GEOMETRY
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
    },
    {
      name: 'some_files',
      title: 'Поле FILE',
      propertyType: PropertyType.FILE
    }
  ]
};
