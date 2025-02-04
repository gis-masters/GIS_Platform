import { PropertySchema, PropertyType } from '../../../../../src/app/services/data/schema/schema.models';

export const systemProperties: PropertySchema[] = [
  {
    name: 'created_at',
    title: 'Когда создано',
    hidden: true,
    propertyType: PropertyType.DATETIME
  },
  {
    name: 'last_modified',
    title: 'Когда отредактировано',
    hidden: true,
    propertyType: PropertyType.DATETIME
  },

  {
    name: 'created_by',
    title: 'Кем создано',
    hidden: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'updated_by',
    title: 'Кем отредактировано',
    hidden: true,
    propertyType: PropertyType.STRING
  }
];
