import { isEqual } from 'lodash';
import { action } from 'mobx';

import { PropertySchema, PropertySchemaUrl, PropertyType, Schema } from '../../services/crg/schema.models';
import { Fias } from '../../services/fias.service';
import { knownRegex } from '../../services/regexp.service';
import { UrlInfo } from './Control/_type/Form-Control_type_url';

const fromComplex: Partial<
  Record<
    PropertyType,
    <T extends Record<string, unknown>>(
      propertySchema: PropertySchema<T>,
      formValue: Partial<T>,
      fieldValue: unknown
    ) => Partial<T>
  >
> = {
  [PropertyType.FIAS]: <T extends Record<string, unknown>>(
    field: PropertySchema<T>,
    formValue: Partial<T>,
    fieldValue: unknown = {}
  ): Partial<T> => {
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

const toComplex: Partial<
  Record<PropertyType, <T extends Record<string, unknown>>(field: PropertySchema<T>, formValue: Partial<T>) => unknown>
> = {
  [PropertyType.FIAS]: <T extends Record<string, unknown>>(field: PropertySchema<T>, formValue: Partial<T>) => {
    const name = String(field.name);

    return {
      fullAddress: formValue[name + '__address'],
      objectId: formValue[name + '__id'],
      oktmo: formValue[name + '__oktmo']
    } as unknown;
  }
};

export const applyFieldValue = action(
  <T extends Record<string, unknown>>(
    propertySchema: PropertySchema<T>,
    formValue: Partial<T>,
    fieldValue: T[keyof T]
  ): Partial<T> => {
    if (fromComplex[propertySchema.propertyType]) {
      return fromComplex[propertySchema.propertyType]<T>(propertySchema, formValue, fieldValue);
    }

    formValue[propertySchema.name] = fieldValue;

    return formValue;
  }
);

export function convertToComplexField<T extends Record<string, unknown>>(
  field: PropertySchema<T>,
  formValue: Partial<T>
): unknown {
  if (toComplex[field.propertyType]) {
    return toComplex[field.propertyType]<T>(field, formValue);
  }

  return formValue[field.name];
}

export function parseUrlValue(value: string, multiple: boolean, editable?: boolean): UrlInfo[] {
  if (value) {
    if (knownRegex.url.test(value)) {
      const url = JSON.parse(value) as string;

      return [{ url, text: url }];
    }

    if (!JSON.parse(value)) {
      return multiple ? [] : [{ url: '', text: '' }];
    }

    if (!Array.isArray(JSON.parse(value))) {
      return [JSON.parse(value) as UrlInfo];
    }

    return JSON.parse(value) as UrlInfo[];
  }

  if (!editable) {
    return [];
  }

  return multiple ? [] : [{ url: '', text: '' }];
}

export function getEditUrlFormSchema(field: PropertySchemaUrl): PropertySchema<UrlInfo>[] {
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

export function isEqualExceptCalculated<T>(a: Partial<T>, b: Partial<T>, schema: Schema<T>): boolean {
  for (const key of Object.keys({ ...a, ...b })) {
    const property = schema?.properties?.find(({ name }) => name === key);
    if (!property?.calculatedValueFormula && !property?.calculatedValueWellKnownFormula && !isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
