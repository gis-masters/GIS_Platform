/* eslint-disable sonarjs/no-duplicate-string */
import { GeometryType } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { PropertySchema, PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';

const propertyDocument: PropertySchema = {
  name: 'field_document',
  title: 'Поле DOCUMENT',
  propertyType: PropertyType.DOCUMENT
};

const propertyFile: PropertySchema = {
  name: 'field_file',
  title: 'Поле FILE',
  propertyType: PropertyType.FILE
};

const propertyUrl: PropertySchema = {
  name: 'field_url',
  title: 'Поле URL',
  propertyType: PropertyType.URL
};

const propertyFias: PropertySchema = {
  name: 'field_fias',
  title: 'Поле FIAS',
  propertyType: PropertyType.FIAS
};
const propertyFiasOktmo: PropertySchema = {
  name: 'field_fias__oktmo',
  title: 'Поле FIAS oktmo',
  hidden: true,
  propertyType: PropertyType.STRING
};
const propertyFiasAddress: PropertySchema = {
  name: 'field_fias__address',
  title: 'Поле FIAS address',
  hidden: true,
  propertyType: PropertyType.STRING
};
const propertyFiasId: PropertySchema = {
  name: 'field_fias__id',
  title: 'Поле FIAS id',
  hidden: true,
  propertyType: PropertyType.INT
};

const propertyGeometry: PropertySchema = {
  name: 'shape',
  title: 'Поле GEOMETRY',
  propertyType: PropertyType.GEOMETRY
};

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
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'name',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'text',
      title: 'текст',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      propertyType: PropertyType.INT,
      description: ''
    },
    {
      name: 'status_adm',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
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
          propertyType: PropertyType.STRING
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
          propertyType: PropertyType.INT
        }
      ]
    },
    {
      id: 'viewsId3',
      title: 'Представление 3',
      styleName: 'forest',
      type: 'VIEW',
      properties: [
        {
          name: 'classid',
          title: 'Значение объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'name',
          title: 'Наименование',
          propertyType: PropertyType.STRING
        },
        {
          name: 'text',
          title: 'текст',
          asTitle: true,
          propertyType: PropertyType.STRING
        },
        {
          name: 'shape',
          title: 'geometry',
          propertyType: PropertyType.GEOMETRY
        },
        {
          name: 'shape_area',
          title: 'Площадь',
          propertyType: PropertyType.INT
        },
        {
          name: 'STATUS_ADM',
          title: 'Статус объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'ruleid',
          title: 'Идентификатор стиля',
          hidden: true,
          required: true,
          propertyType: PropertyType.STRING
        }
      ]
    },
    {
      id: 'viewsId4',
      title: 'Представление 4',
      styleName: 'forest',
      type: 'VIEW',
      properties: [
        {
          name: 'classid',
          title: 'Значение объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'shape',
          title: 'geometry',
          propertyType: PropertyType.GEOMETRY
        },
        {
          name: 'STATUS_ADM',
          title: 'Статус объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'ruleid',
          title: 'Идентификатор стиля',
          hidden: true,
          required: true,
          propertyType: PropertyType.STRING
        }
      ]
    }
  ],
  description: 'Границы1',
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaForTestTitles: Schema = {
  name: 'schemaForTestTitles',
  title: 'Административное деление с заголовками',
  readOnly: false,
  tableName: 'border1',
  styleName: 'admemo',
  properties: [
    {
      name: 'classid',
      title: 'Значение объекта',
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'text',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      propertyType: PropertyType.INT
    },
    {
      name: 'STATUS_ADM',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    }
  ],
  views: [
    {
      id: 'viewsId1',
      title: 'Представление 1',
      styleName: 'forest',
      type: 'VIEW',
      properties: [
        {
          name: 'classid',
          title: 'Значение объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'name',
          title: 'Наименование',
          propertyType: PropertyType.STRING
        },
        {
          name: 'shape',
          title: 'geometry',
          propertyType: PropertyType.GEOMETRY
        },
        {
          name: 'shape_area',
          asTitle: true,
          title: 'Площадь',
          propertyType: PropertyType.INT
        },
        {
          name: 'STATUS_ADM',
          title: 'Статус объекта',
          propertyType: PropertyType.CHOICE,
          options: []
        },
        {
          name: 'ruleid',
          title: 'Идентификатор стиля',
          hidden: true,
          required: true,
          propertyType: PropertyType.STRING
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
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'name',
      title: 'Наименование объекта',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape_area',
      title: 'Площадь, кв.м',
      propertyType: PropertyType.FLOAT
    },
    {
      name: 'status_adm',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: []
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    }
  ],
  description: 'Границы2',
  geometryType: GeometryType.MULTI_POLYGON
};

const schemaWithInappropriateStyleName: Schema = {
  name: 'schemaWithInappropriateStyleName',
  title: 'Схема с несоответствующим слою StyleName 1',
  readOnly: false,
  tableName: 'border2',
  styleName: 'buildings',
  properties: [
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'ruleid',
      title: 'Идентификатор',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    }
  ],
  description: 'Границы2',
  geometryType: GeometryType.MULTI_POLYGON
};

const testSortingSchema: Schema = {
  name: 'test_sorting__schema',
  title: 'Схема для тестирования сортировки 1',
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
      name: 'some_document',
      title: 'Поле DOCUMENT',
      propertyType: PropertyType.DOCUMENT
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
  title: 'Схема с типами данных недоступными для сортировки 2',
  description: 'Схема для тестирования сортировки в атрибутивной таблице. Версия 2',
  readOnly: true,
  tableName: 'test_sorting__v2',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [propertyUrl, propertyFias, propertyFile, propertyDocument, propertyGeometry]
};

const testSchemaWithAllTypes: Schema = {
  name: 'testSchemaWithAllTypes',
  title: 'Схема содержащая все типы данных 1',
  description: 'Схема содержащая все типы данных. Версия 1',
  readOnly: false,
  tableName: 'test_sorting__v2',
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
    propertyUrl,
    propertyFias,
    propertyFiasOktmo,
    propertyFiasAddress,
    propertyFiasId,
    propertyFile,
    propertyDocument,
    propertyGeometry
  ]
};

const testSchemaWithAllTypesUpdated: Schema = {
  name: 'testSchemaWithAllTypes',
  title: 'Схема содержащая все типы данных',
  description: 'Схема содержащая все типы данных. Версия 1',
  readOnly: false,
  tableName: 'test_sorting__v2',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'field_int',
      title: 'Поле INT',
      asTitle: true,
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
    propertyUrl,
    propertyFias,
    propertyFile,
    propertyDocument,
    propertyGeometry
  ]
};

export const testSchemas: { [key: string]: Schema } = {
  'Схема для тестирования сортировки': testSortingSchema,
  'Схема в режиме редактирования': testSortingSchema,
  'Схема с несоответствующим слою StyleName': schemaWithInappropriateStyleName,
  'Схема с типами данных недоступными для сортировки': testSortingSchema2,
  'Схема в режиме чтения': testSortingSchema2,
  'Схема с представлениями': schemaWithViews,
  'Схема без представлений': schemaWithoutViews,
  'Схема с заголовками объектов': schemaForTestTitles,
  'Схема содержащая все типы данных': testSchemaWithAllTypes,
  'Схема содержащая все типы данных и аттрибут asTitle': testSchemaWithAllTypesUpdated,
  'Схема содержащая все типы данных в режиме редактирования': testSchemaWithAllTypes,
  'Схема содержащая все типы данных в режиме чтения': {
    ...testSchemaWithAllTypes,
    readOnly: true,
    name: `${testSchemaWithAllTypes.name}_readOnly`
  }
};

export function getTestSchemaByName(schemaName: string): Schema {
  const schema = Object.values(testSchemas).find(schema => schema.name === schemaName);
  if (!schema) {
    throw new Error('Не найдена схема по name:' + schemaName);
  }

  return schema;
}

export function getTestSchema(title: string): Schema {
  const schema = testSchemas[title];
  if (!schema) {
    throw new Error(`Запрошена неизвестная схема: '${title}'! Создайте схему в testSchemas.ts предварительно.`);
  }

  return schema;
}
