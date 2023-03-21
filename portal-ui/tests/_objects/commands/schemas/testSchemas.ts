import { PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../src/app/services/geoserver/wfs/wfs.models';

const schemaWithViews: Schema = {
  name: 'schemaWithViews',
  title: 'Административное деление с представлениями',
  readOnly: false,
  tableName: 'border1',
  styleName: 'admemo',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Территория населенного пункта',
          value: '601020400'
        },
        {
          title: 'Муниципальный район',
          value: '601020301'
        },
        {
          title: 'Сельское поселение',
          value: '601020307'
        }
      ]
    },
    {
      name: 'name',
      title: 'Наименование',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    },
    {
      name: 'shape',
      title: 'geometry',
      required: false,
      hidden: false,
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    },
    {
      name: 'STATUS_ADM',
      title: 'Статус объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Существующий',
          value: '1'
        },
        {
          title: 'Планируемый',
          value: '2'
        }
      ]
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    }
  ],
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      type: 'VIEW',
      properties: [
        {
          name: 'name',
          title: 'Наименование объекта',
          hidden: false,
          required: false,
          propertyType: PropertyType.STRING,
          description: ''
        }
      ]
    },
    {
      id: 'viewsId2',
      title: 'Представление 2',
      type: 'VIEW',
      properties: [
        {
          name: 'shape_area',
          title: 'Площадь, кв.м',
          hidden: false,
          required: true,
          propertyType: PropertyType.FLOAT,
          description: ''
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaWithoutViews: Schema = {
  name: 'schemaWithoutViews',
  title: 'Административное деление',
  readOnly: false,
  tableName: 'border2',
  styleName: 'admemo',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Территория населенного пункта',
          value: '601020400'
        },
        {
          title: 'Муниципальный район',
          value: '601020301'
        },
        {
          title: 'Сельское поселение',
          value: '601020307'
        }
      ]
    },
    {
      name: 'shape',
      title: 'geometry',
      required: false,
      hidden: false,
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'name',
      title: 'Наименование объекта',
      hidden: false,
      required: false,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    },
    {
      name: 'shape_area',
      title: 'Площадь, кв.м',
      hidden: false,
      required: true,
      propertyType: PropertyType.FLOAT,
      description: ''
    },
    {
      name: 'STATUS_ADM',
      title: 'Статус объекта',
      hidden: false,
      multiple: false,
      required: false,
      propertyType: PropertyType.CHOICE,
      description: '',
      options: [
        {
          title: 'Существующий',
          value: '1'
        },
        {
          title: 'Планируемый',
          value: '2'
        }
      ]
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      maxLength: 254,
      minLength: -1,
      propertyType: PropertyType.STRING,
      description: ''
    }
  ],
  description: 'Границы2',
  geometryType: GeometryType.MULTI_POLYGON
};

const testSortingSchema: Schema = {
  name: 'test_sorting__schema',
  title: 'Схема для тестирования сортировки',
  description: 'Схема для тестирования сортировки в атрибутивной таблице. Версия 1',
  readOnly: false,
  tableName: 'test_sorting__v1',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'number_int',
      title: 'Поле INT',
      propertyType: PropertyType.INT
    },
    {
      name: 'number_double',
      title: 'Поле FLOAT',
      propertyType: PropertyType.FLOAT
    },
    {
      name: 'some_string',
      title: 'Поле STRING',
      propertyType: PropertyType.STRING
    },
    {
      name: 'some_date',
      title: 'Поле DATETIME',
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'is_enabled',
      title: 'Поле BOOL',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'obj_code',
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
      name: 'shape',
      title: 'Поле для геометрии',
      propertyType: PropertyType.GEOMETRY
    }
  ]
};

const testSortingSchema2: Schema = {
  name: 'test_sorting__schema2',
  title: 'Схема с типами данных недоступными для сортировки',
  description: 'Схема для тестирования сортировки в атрибутивной таблице. Версия 2',
  readOnly: false,
  tableName: 'test_sorting__v2',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
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
    }
  ]
};

export const testSchemas: { [key: string]: Schema } = {
  'Схема с представлениями': schemaWithViews,
  'Схема без представлений': schemaWithoutViews,
  'Схема для тестирования сортировки': testSortingSchema,
  'Схема с типами данных недоступными для сортировки': testSortingSchema2
};
