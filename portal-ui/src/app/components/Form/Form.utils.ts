import { createElement } from 'react';
import { ListItemIcon, Tooltip } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { isEqual } from 'lodash';
import { action } from 'mobx';

import {
  ContentType,
  PropertyOption,
  PropertySchema,
  PropertySchemaUrl,
  PropertyType,
  Schema,
  SimpleSchema,
  ValueFormula
} from '../../services/data/schema/schema.models';
import { valueWellKnownFormulas } from '../../services/data/schema/schema.utils';
import { UrlInfo } from './Control/_type/Form-Control_type_url';
import { Fias } from '../../services/data/fias/fias.models';
import { services } from '../../services/services';

const fromComplex: Partial<
  Record<PropertyType, <T>(propertySchema: PropertySchema, formValue: Partial<T>, fieldValue: unknown) => Partial<T>>
> = {
  [PropertyType.FIAS]: <T>(field: PropertySchema, formValue: Partial<T>, fieldValue: unknown = {}): Partial<T> => {
    const fias = fieldValue as Fias;
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

    return {
      address: formValue[name + '__address'] as string,
      id: formValue[name + '__id'] as number,
      oktmo: formValue[name + '__oktmo'] as string
    };
  }
};

const _applyFieldValue = <T>(
  propertySchema: PropertySchema,
  formValue: Partial<T>,
  fieldValue: T[keyof T & string]
): Partial<T> => {
  if (fromComplex[propertySchema.propertyType]) {
    return fromComplex[propertySchema.propertyType]<T>(propertySchema, formValue, fieldValue);
  }

  formValue[propertySchema.name] = fieldValue;

  return formValue;
};

export const applyFieldValue = action(_applyFieldValue);

export function convertToComplexField<T>(field: PropertySchema, formValue: Partial<T>): unknown {
  if (toComplex[field.propertyType]) {
    return toComplex[field.propertyType]<T>(field, formValue);
  }

  return formValue[field.name];
}

export function parseUrlValue(value: string, multiple: boolean, editable?: boolean): UrlInfo[] {
  if (value) {
    try {
      const parsedValue = JSON.parse(value) as UrlInfo | UrlInfo[];

      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }

      if (!parsedValue) {
        return multiple ? [] : [{ url: '', text: '' }];
      }

      if (!Array.isArray(parsedValue)) {
        return [parsedValue];
      }
    } catch {
      services.logger.warn('Неверное значение url: ', value);
    }
  }

  if (!editable) {
    return [];
  }

  return multiple ? [] : [{ url: '', text: '' }];
}

export function getEditUrlFormSchema(field: PropertySchemaUrl): PropertySchema[] {
  return [
    {
      name: 'url',
      title: 'Адрес ссылки',
      propertyType: PropertyType.STRING,
      regex: field.regex,
      wellKnownRegex: (!field.regex && field.wellKnownRegex) || 'url'
    },
    {
      name: 'text',
      title: 'Название',
      propertyType: PropertyType.STRING
    }
  ];
}

export function isEqualExceptCalculated<T>(
  a: Partial<T> = {},
  b: Partial<T> = {},
  schema: Schema | SimpleSchema
): boolean {
  for (const key of Object.keys({ ...a, ...b })) {
    const property = schema?.properties?.find(({ name }) => name === key);
    if (!property?.calculatedValueFormula && !property?.calculatedValueWellKnownFormula && !isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function getViewChoiceOptions(views: ContentType[]): PropertyOption[] | undefined {
  return [
    { title: 'Вид по умолчанию', value: '' },
    ...(views?.map(type => {
      return {
        title: type.title,
        value: type.id,
        endIcon: type.definitionQuery
          ? createElement(Tooltip, {
              title: createElement(
                'span',
                {},
                'Для этого представления задан определяющий запрос (Definition Query). Будут отображены только объекты, удовлетворяющие условию запроса:',
                createElement('br'),
                createElement('code', { children: type.definitionQuery })
              ),
              children: createElement(ListItemIcon, {}, createElement(FilterAltOutlined, { fontSize: 'small' }))
            })
          : undefined
      };
    }) || [])
  ];
}

export function getDefaultValues<T>(properties: PropertySchema[], parent: unknown = {}): Partial<T> {
  const values: Partial<T> = {};
  for (const property of properties) {
    if (property.defaultValue !== undefined) {
      Object.assign(
        values,
        fromComplex[property.propertyType]
          ? fromComplex[property.propertyType](property, values, property.defaultValue)
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
            ? fromComplex[property.propertyType](property, values, formula(values, property, parent))
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
            ? fromComplex[property.propertyType](property, values, formula(values, property, parent))
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
