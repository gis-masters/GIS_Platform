import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './allTypes';

export const allTypesChoiceAsString: Schema = {
  ...allTypes,
  name: 'allTypesChoiceAsString',
  title: 'Все типы данных с CHOICE как STRING',
  tableName: 'all_types_choice_as_string',
  properties: [
    ...allTypes.properties.filter(property => property.name !== 'field_choice'),
    {
      name: 'field_choice',
      title: 'Поле CHOICE as STRING',
      propertyType: PropertyType.STRING
    }
  ]
};
