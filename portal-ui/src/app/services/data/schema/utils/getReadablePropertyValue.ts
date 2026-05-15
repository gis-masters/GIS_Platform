import { type DocumentInfo } from '../../../../components/Documents/Documents';
import { formatDate } from '../../../util/date.util';
import { isArray } from '../../../util/typeGuards/isArray';
import { type FileInfo } from '../../files/files.models';
import {
  type PropertySchema,
  type PropertySchemaChoice,
  type PropertySchemaDatetime,
  type PropertySchemaFloat,
  PropertyType
} from '../schema.models';

const valueToReadableTransformers: Partial<Record<PropertyType, (val: unknown, prop: PropertySchema) => string>> = {
  [PropertyType.BOOL](value: unknown) {
    return ['true', '1'].includes(String(value).toLowerCase()) ? 'да' : 'нет';
  },

  [PropertyType.CHOICE](value: unknown, property: PropertySchema) {
    const choiceProperty = property as PropertySchemaChoice;

    const exactMatch = choiceProperty.options.find(option => option.value === value);
    if (exactMatch) {
      return exactMatch.title;
    }

    const stringValue = String(value);
    const typeAgnosticMatch = choiceProperty.options.find(option => option.value === stringValue);

    return typeAgnosticMatch?.title || String(value);
  },

  [PropertyType.DATETIME](value: unknown, property: PropertySchema) {
    return typeof value === 'number' || typeof value === 'string' || value instanceof Date
      ? formatDate(value, (property as PropertySchemaDatetime).format)
      : '';
  },

  [PropertyType.DOCUMENT](value: unknown) {
    try {
      if (typeof value === 'string' || isArray(value)) {
        const documents = isArray(value) ? (value as DocumentInfo[]) : (JSON.parse(value) as DocumentInfo[]);

        return documents.map(({ title }) => title).join(', ');
      }
    } catch {}

    return '';
  },

  [PropertyType.FILE](value: unknown) {
    try {
      if (typeof value === 'string' || isArray(value)) {
        const files = isArray(value) ? (value as FileInfo[]) : (JSON.parse(value) as FileInfo[]);

        return files.map(({ title }) => title).join(', ');
      }
    } catch {}

    return '';
  },

  [PropertyType.FLOAT](value: unknown, property: PropertySchema) {
    const precision = (property as PropertySchemaFloat).precision;

    if (value && typeof precision === 'number') {
      value = Number(value).toFixed(precision);
    }

    return String(value).replace('.', ',');
  }
};

export function getReadablePropertyValue(value: unknown, property?: PropertySchema): string {
  if (
    property?.propertyType !== PropertyType.BOOL &&
    (value === null || value === undefined || property === undefined)
  ) {
    return '';
  }

  const transformer = valueToReadableTransformers[property.propertyType];
  if (transformer) {
    return transformer(value, property);
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}
