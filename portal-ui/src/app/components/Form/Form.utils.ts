import { action } from 'mobx';
import { isEqual } from 'lodash';

import { FiasValue } from '../../services/data/fias/fias.models';
import {
  PropertyFormula,
  PropertySchema,
  PropertyType,
  Schema,
  SimpleSchema,
  ValueFormula
} from '../../services/data/schema/schema.models';
import { valueWellKnownFormulas } from '../../services/data/schema/schema.utils';

const fromComplex: Partial<
  Record<PropertyType, <T>(propertySchema: PropertySchema, formValue: Partial<T>, fieldValue: unknown) => Partial<T>>
> = {
  [PropertyType.FIAS]: <T>(field: PropertySchema, formValue: Partial<T>, fieldValue: unknown = {}): Partial<T> => {
    const fias = fieldValue as FiasValue;
    const name = String(field.name);

    return {
      ...formValue,
      [name + '__address']: fias.address,
      [name + '__id']: fias.id,
      [name + '__oktmo']: fias.oktmo
    };
  }
};

const toComplex: Partial<Record<PropertyType, <T>(field: PropertySchema, formValue: Partial<T>) => unknown>> = {
  [PropertyType.FIAS]: <T>(field: PropertySchema, formValue: Partial<T>) => {
    const name = String(field.name);

    const value: FiasValue = {
      address: formValue[(name + '__address') as keyof T] as string,
      id: formValue[(name + '__id') as keyof T] as number,
      oktmo: formValue[(name + '__oktmo') as keyof T] as string
    };

    return value;
  }
};

const _applyFieldValue = <T>(
  propertySchema: PropertySchema,
  formValue: Partial<T>,
  fieldValue: T[keyof T & string]
): Partial<T> => {
  const complexifier = fromComplex[propertySchema.propertyType];

  if (complexifier) {
    return complexifier<T>(propertySchema, formValue, fieldValue);
  }

  formValue[propertySchema.name as keyof T] = fieldValue;

  return formValue;
};

export const applyFieldValue = action(_applyFieldValue);

export function convertToComplexField<T>(field: PropertySchema, formValue: Partial<T>): unknown {
  if (toComplex[field.propertyType]) {
    return toComplex[field.propertyType]?.<T>(field, formValue);
  }

  return formValue[field.name as keyof T];
}

export function isEqualExceptCalculated<T>(
  a: Partial<T> = {},
  b: Partial<T> = {},
  schema: Schema | SimpleSchema
): boolean {
  for (const key of Object.keys({ ...a, ...b })) {
    const property = schema.properties?.find(({ name }) => name === key);
    if (!property?.calculatedValueFormula && !property?.calculatedValueWellKnownFormula && !isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function getDefaultValues<T>(properties: PropertySchema[], parent: unknown = {}): Partial<T> {
  const values: Partial<T> = {};
  for (const property of properties) {
    if (property.defaultValue !== undefined) {
      Object.assign(
        values,
        fromComplex[property.propertyType]
          ? fromComplex[property.propertyType]?.(property, values, property.defaultValue)
          : { [property.name]: property.defaultValue }
      );
    }

    if (property.defaultValueFormula) {
      try {
        const formula: ValueFormula =
          typeof property.defaultValueFormula === 'string'
            ? // eslint-disable-next-line @typescript-eslint/no-implied-eval
              (new Function('obj', 'property', 'parent', property.defaultValueFormula) as ValueFormula)
            : property.defaultValueFormula;

        Object.assign(
          values,
          fromComplex[property.propertyType]
            ? fromComplex[property.propertyType]?.(property, values, formula(values, property, parent))
            : { [property.name]: formula(values, property, parent) }
        );
      } catch (error) {
        throw new Error(`Ошибка при попытке вычислить значение по-умолчанию: ${String(error)}`);
      }
    }

    if (property.defaultValueWellKnownFormula && valueWellKnownFormulas[property.defaultValueWellKnownFormula]) {
      try {
        const formula = valueWellKnownFormulas[property.defaultValueWellKnownFormula];

        Object.assign(
          values,
          fromComplex[property.propertyType]
            ? fromComplex[property.propertyType]?.(property, values, formula(values, property, parent))
            : { [property.name]: formula(values, property, parent) }
        );
      } catch (error) {
        throw new Error(
          `Ошибка при попытке вычислить значение по-умолчанию [${property.defaultValueWellKnownFormula}]: ${String(
            error
          )}`
        );
      }
    }
  }

  return values;
}

export function computeDynamicProperties<T extends SimpleSchema>(formValue: unknown, schema: T): T {
  return {
    ...schema,
    properties: schema.properties.map(property => {
      if (!property.dynamicPropertyFormula) {
        return property;
      }

      let formula = property.dynamicPropertyFormula;

      try {
        if (typeof formula === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          formula = new Function('obj', 'property', formula) as PropertyFormula;
        }

        return {
          ...property,
          ...formula(formValue, property)
        } as PropertySchema;
      } catch (error) {
        console.error('Ошибка при обработке динамического поля формы', error);

        return property;
      }
    })
  };
}
