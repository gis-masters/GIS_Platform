import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './allTypes';

export const allTypesWithAsTitle: Schema = {
  ...allTypes,
  name: 'allTypesWithAsTitle',
  title: 'Все типы данных с атрибутом asTitle',
  tableName: 'all_types_with_as_title',
  properties: [
    {
      name: 'field_int',
      title: 'Поле INT',
      propertyType: PropertyType.INT,
      asTitle: true
    },
    ...allTypes.properties.slice(1)
  ]
};
