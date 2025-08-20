import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const testNotSorting: Schema = {
  name: 'testNotSorting',
  title: 'С недоступными для сортировки типами данных',
  description: 'Для тестирования сортировки в атрибутивной таблице c недоступными для сортировки типами данных',
  readOnly: true,
  tableName: 'test_not_sorting',
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
