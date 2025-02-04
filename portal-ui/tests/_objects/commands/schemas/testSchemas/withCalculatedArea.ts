import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './allTypes';

export const withCalculatedArea: Schema = {
  ...allTypes,
  name: 'withCalculatedArea',
  title: 'Схема с калькулируемым полем',
  tableName: 'with_calculated_area',
  properties: [
    ...allTypes.properties,
    {
      name: 'area_generated',
      title: 'Авто площадь, м',
      readOnly: true,
      propertyType: PropertyType.FLOAT,
      precision: 2,
      calculatedValueWellKnownFormula: 'st_area'
    },
    {
      name: 'length_generated',
      title: 'Авто длина, м',
      readOnly: true,
      propertyType: PropertyType.FLOAT,
      precision: 2,
      calculatedValueWellKnownFormula: 'st_length'
    }
  ]
};
