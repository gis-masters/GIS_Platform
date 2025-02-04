import { describe, expect, test } from '@jest/globals';

import { PropertySchema, PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { computeDynamicProperties } from './Form.utils';

describe('вычисление динамических свойств схемы computeDynamicProperties', () => {
  const baseProperty: PropertySchema = {
    name: 'some',
    title: 'Что-то',
    propertyType: PropertyType.STRING
  };

  const formValue = { other: 1 };

  test('формулу вычисления динамического свойства можно указать функцией', () => {
    const property: PropertySchema = {
      ...baseProperty,
      dynamicPropertyFormula: obj => ({ required: isRecordStringUnknown(obj) && obj.other === 1 })
    };

    const schema: SimpleSchema = {
      properties: [property]
    };

    expect(computeDynamicProperties(formValue, schema).properties[0]).toStrictEqual({ ...property, required: true });
  });

  test('формулу вычисления динамического свойства можно указать строкой', () => {
    const property: PropertySchema = {
      ...baseProperty,
      dynamicPropertyFormula: 'return { required: obj?.other === 1 }'
    };

    const schema: SimpleSchema = {
      properties: [property]
    };

    expect(computeDynamicProperties(formValue, schema).properties[0]).toStrictEqual({ ...property, required: true });
  });
});
