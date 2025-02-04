import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';

export const createDocumentsSource: Schema = {
  name: 'createDocumentsSource',
  title: 'источник документов',
  tableName: 'test_source',
  description: 'Для создания документа одной библиотеки на основе документа другой библиотеки',
  children: [
    {
      library: 'test_target',
      contentType: 'doc'
    }
  ],
  properties: [
    {
      name: 'title',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'email',
      title: 'E-mail',
      propertyType: PropertyType.STRING
    },
    {
      name: 'surname',
      title: 'Фамилия',
      propertyType: PropertyType.STRING
    },
    {
      name: 'name',
      title: 'Имя',
      propertyType: PropertyType.STRING
    },
    {
      name: 'patronym',
      title: 'Отчество',
      propertyType: PropertyType.STRING
    },
    {
      name: 'path',
      title: 'Путь',
      propertyType: PropertyType.STRING
    },
    {
      name: 'is_folder',
      title: 'Папка',
      hidden: true,
      propertyType: PropertyType.BOOL
    },
    {
      name: 'created_at',
      title: 'Создано',
      hidden: true,
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'last_modified',
      title: 'Изменено',
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
      name: 'updated_by',
      title: 'Кем отредактировано',
      hidden: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'content_type_id',
      title: 'Тип',
      hidden: true,
      propertyType: PropertyType.STRING
    }
  ],
  contentTypes: [
    {
      id: 'doc_v1',
      type: 'DOCUMENT',
      title: 'Входящий документ',
      properties: [
        {
          name: 'title'
        },
        {
          name: 'email'
        },
        {
          name: 'surname'
        },
        {
          name: 'name'
        },
        {
          name: 'patronym'
        }
      ]
    }
  ]
};
