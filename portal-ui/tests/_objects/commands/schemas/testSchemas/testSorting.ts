import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const testSorting: Schema = {
  name: 'testSorting',
  title: 'Для тестирования сортировки',
  description: 'Для тестирования сортировки в атрибутивной таблице',
  readOnly: false,
  tableName: 'test_sorting',
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
        { title: 'Модульная двухсторонняя', value: '1111' },
        { title: 'Модульная односторонняя', value: '1122' },
        { title: 'Отдельно стоящий короб', value: '55' }
      ]
    },
    {
      name: 'shape',
      title: 'Поле для геометрии',
      propertyType: PropertyType.GEOMETRY
    }
  ]
};
