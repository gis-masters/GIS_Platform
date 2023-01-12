import { isEqual } from 'lodash';
import { action } from 'mobx';

import {
  ContentType,
  PropertyOption,
  PropertySchema,
  PropertySchemaUrl,
  PropertyType,
  Schema
} from '../../services/data/schema.models';
import { UrlInfo } from './Control/_type/Form-Control_type_url';
import { Fias } from '../../services/data/fias.service';
import { services } from '../../services/services';

const fromComplex: Partial<
  Record<PropertyType, <T>(propertySchema: PropertySchema, formValue: Partial<T>, fieldValue: unknown) => Partial<T>>
> = {
  [PropertyType.FIAS]: <T>(field: PropertySchema, formValue: Partial<T>, fieldValue: unknown = {}): Partial<T> => {
    const fias = fieldValue as Fias;
    const name = String(field.name);

    return {
      ...formValue,
      [name + '__address']: fias.fullAddress,
      [name + '__id']: fias.objectId,
      [name + '__oktmo']: fias.oktmo
    };
  }
};

const toComplex: Partial<Record<PropertyType, <T>(field: PropertySchema, formValue: Partial<T>) => unknown>> = {
  [PropertyType.FIAS]: <T>(field: PropertySchema, formValue: Partial<T>) => {
    const name = String(field.name);

    return {
      fullAddress: formValue[name + '__address'] as string,
      objectId: formValue[name + '__id'] as number,
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

export function isEqualExceptCalculated<T>(a: Partial<T> = {}, b: Partial<T> = {}, schema: Schema): boolean {
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
      return { title: type.title, value: type.id };
    }) || [])
  ];
}
