import { cloneDeep } from 'lodash';

import { OldSchema, OldPropertySchema, OldContentType, ValueType } from './schemaOld.models';
import {
  PropertyType,
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaUrl,
  Schema,
  ContentType,
  ValueFormula,
  Relation
} from './schema.models';
import { LibraryRecord } from './doc-library.service';
import { DocumentInfo } from '../../components/Documents/Documents';
import { formatDate } from '../util/date.util';
import { FileInfo } from './files.service';

export function applyContentTypeOld(schema: OldSchema, contentTypeId?: string): OldSchema {
  const clonedSchema = cloneDeep(schema);

  const contentType = clonedSchema.contentTypes.find(cType => cType.id === contentTypeId);

  if (contentType) {
    const { attributes, children, childOnly, printTemplates } = contentType;
    const actualProperties: OldPropertySchema[] = attributes.map(contentTypeDescription => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeDescription.name);

      return { ...schemaProperty, ...contentTypeDescription };
    });

    Object.assign(clonedSchema, { properties: actualProperties, children, childOnly, printTemplates });
  }

  return clonedSchema;
}

export function applyContentType(schema: Schema, contentTypeId: string): Schema {
  const clonedSchema = cloneDeep(schema);

  const contentType = clonedSchema.contentTypes.find(cType => cType.id === contentTypeId);

  if (contentType) {
    const {
      title,
      properties,
      children = schema.children,
      childOnly = schema.childOnly,
      printTemplates = schema.printTemplates,
      relations = schema.relations
    } = contentType;
    const actualProperties: PropertySchema[] = properties.map(contentTypeProperty => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeProperty.name);

      return { ...schemaProperty, ...contentTypeProperty } as PropertySchema;
    });

    Object.assign(clonedSchema, {
      title,
      properties: actualProperties,
      children,
      childOnly,
      printTemplates,
      relations
    });
  }

  return clonedSchema;
}

export function convertSchema<T extends Record<string, unknown>>({
  name,
  title,
  description,
  geometryType,
  readOnly,
  children,
  childOnly,
  printTemplates,
  relations,
  properties,
  contentTypes
}: OldSchema<T>): Schema<T> {
  return {
    name,
    title,
    description,
    geometryType,
    readOnly,
    children,
    childOnly,
    printTemplates,
    relations,
    properties: convertProperties(properties),
    contentTypes: contentTypes.map(convertContentType)
  };
}

function convertContentType(contentType: OldContentType): ContentType {
  return { ...contentType, properties: convertProperties(contentType.attributes) };
}

export function convertProperties<T extends Record<string, unknown>>(
  oldFields: OldPropertySchema<T>[]
): PropertySchema<T>[] {
  return oldFields.map(oldField => {
    const field: Partial<PropertySchema<T>> = { ...oldField };

    if (oldField.valueType === ValueType.STRING || oldField.valueType === ValueType.TEXT) {
      field.propertyType = PropertyType.STRING;
    }

    field.asTitle = oldField.objectIdentityOnUi;

    if (oldField.valueType === ValueType.DOUBLE) {
      field.propertyType = PropertyType.FLOAT;

      (field as Partial<PropertySchemaFloat>).precision = oldField.fractionDigits;
    }

    if (oldField.valueType === ValueType.INT) {
      field.propertyType = PropertyType.INT;
    }

    if (oldField.valueType === ValueType.CHECKBOX) {
      field.propertyType = PropertyType.BOOL;
    }

    if (oldField.valueType === ValueType.BOOLEAN) {
      field.propertyType = PropertyType.BOOL;
    }

    if (oldField.valueType === ValueType.DATETIME) {
      field.propertyType = PropertyType.DATETIME;

      (field as Partial<PropertySchemaDatetime>).format = oldField.dateFormat;
    }

    if (oldField.valueType === ValueType.CHOICE) {
      field.propertyType = PropertyType.CHOICE;

      (field as Partial<PropertySchemaChoice>).multiple = oldField.isMultiple;

      (field as Partial<PropertySchemaChoice>).options = oldField.enumerations;
    }

    if (oldField.valueType === ValueType.URL) {
      field.propertyType = PropertyType.URL;

      (field as Partial<PropertySchemaUrl>).openIn = oldField.displayMode === 'in_popup' ? 'popup' : 'newTab';
    }

    if (oldField.valueType === ValueType.LOOKUP) {
      field.propertyType = PropertyType.LOOKUP;
    }

    if (oldField.valueType === ValueType.BINARY) {
      field.propertyType = PropertyType.BINARY;
    }

    if (oldField.valueType === ValueType.SET) {
      field.propertyType = PropertyType.SET;
    }

    if (oldField.valueType === ValueType.FIAS) {
      field.propertyType = PropertyType.FIAS;
    }

    if (oldField.valueType === ValueType.FILE) {
      field.propertyType = PropertyType.FILE;
    }

    if (oldField.valueType === ValueType.DOCUMENT) {
      field.propertyType = PropertyType.DOCUMENT;
    }

    delete (field as Partial<OldPropertySchema>).valueType;

    return field as PropertySchema<T>;
  });
}

export const valueWellKnownFormulas: Record<string, ValueFormula> = {
  inherit: (obj, property, parent) => parent[property.name],
  parentDocument: (obj, property, parent: LibraryRecord) => {
    const value: DocumentInfo[] = [{ id: parent.id, libraryId: parent.libraryId, title: parent.title }];

    return JSON.stringify(value);
  },
  relationLink: (obj, { valueFormulaParams }) =>
    JSON.stringify({
      url:
        `/data-management/library/${String(valueFormulaParams.library)}/registry?filter=` +
        encodeURI(
          JSON.stringify({ applicant_name: { $ilike: `%${String(obj[valueFormulaParams.property as string])}%` } })
        ),
      text: valueFormulaParams.title
    })
};

export function getFieldRelations<T>(field: string | number, schema: Schema<T>): Relation[] {
  return schema?.relations?.filter(relation => relation.property === field) || [];
}

const valueToReadableTransformers: Partial<Record<PropertyType, (value: unknown, property: PropertySchema) => string>> =
  {
    [PropertyType.BOOL](value: unknown) {
      return ['true', '1'].includes(String(value).toLowerCase()) ? 'да' : 'нет';
    },

    [PropertyType.CHOICE](value: unknown, property: PropertySchema) {
      return (property as PropertySchemaChoice).options.find(({ value }) => value === value)?.title || String(value);
    },

    [PropertyType.DATETIME](value: unknown, property: PropertySchema) {
      return typeof value === 'number' || typeof value === 'string' || value instanceof Date
        ? formatDate(value, (property as PropertySchemaDatetime).format)
        : '';
    },

    [PropertyType.DOCUMENT](value: unknown) {
      try {
        if (typeof value === 'string' || Array.isArray(value)) {
          const documents = Array.isArray(value) ? (value as DocumentInfo[]) : (JSON.parse(value) as DocumentInfo[]);

          return documents.map(({ title }) => title).join(', ');
        }
      } catch {}

      return '';
    },

    [PropertyType.FILE](value: unknown) {
      try {
        if (typeof value === 'string' || Array.isArray(value)) {
          const files = Array.isArray(value) ? (value as FileInfo[]) : (JSON.parse(value) as FileInfo[]);

          return files.map(({ title }) => title).join(', ');
        }
      } catch {}

      return '';
    },

    [PropertyType.FLOAT](value: unknown, property: PropertySchemaFloat) {
      if (value && typeof property.precision === 'number') {
        value = Number(value).toFixed(property.precision);
      }

      return String(value).replace('.', ',');
    }
  };

export function getReadablePropertyValue(value: unknown, property: PropertySchema): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (valueToReadableTransformers[property.propertyType]) {
    return valueToReadableTransformers[property.propertyType](value, property);
  }

  return String(value ?? '');
}
