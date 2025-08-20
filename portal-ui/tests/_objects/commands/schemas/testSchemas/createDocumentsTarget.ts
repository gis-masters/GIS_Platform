import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';

export const createDocumentsTarget: Schema = {
  name: 'createDocumentsTarget',
  title: 'документы из других документов',
  tableName: 'test_target',
  description: 'Для тестирования создания документа одной библиотеки на основе документа другой библиотеки',
  properties: [
    {
      name: 'title',
      defaultValueWellKnownFormula: 'inherit',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'login',
      readOnly: true,
      defaultValueFormula: 'return parent.email',
      title: 'Логин',
      propertyType: PropertyType.STRING
    },
    {
      name: 'fio',
      title: 'ФИО',
      readOnly: true,
      defaultValueFormula: 'return `${parent.name} ${parent.patronym} ${parent.surname}`',
      propertyType: PropertyType.STRING
    },
    {
      name: 'source',
      title: 'Документ-источник',
      readOnly: true,
      defaultValueWellKnownFormula: 'parentDocument',
      propertyType: PropertyType.DOCUMENT
    },
    {
      name: 'specialist',
      title: 'Специалист',
      required: true,
      propertyType: PropertyType.USER
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
      name: 'content_type_id',
      title: 'Тип',
      hidden: true,
      propertyType: PropertyType.STRING
    }
  ],
  contentTypes: [
    {
      id: 'doc',
      type: 'DOCUMENT',
      title: 'Заявка в работе',
      childOnly: true,
      properties: [
        {
          name: 'title'
        },
        {
          name: 'login'
        },
        {
          name: 'fio'
        },
        {
          name: 'source'
        },
        {
          name: 'specialist'
        }
      ]
    },
    {
      id: 'folder_v1',
      type: 'FOLDER',
      title: 'Папка',
      properties: [
        {
          name: 'title'
        }
      ]
    }
  ]
};
