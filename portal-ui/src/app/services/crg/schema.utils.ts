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
  DefaultValueFormula
} from './schema.models';
import { LibraryRecord } from './doc-library.service';
import { DocumentInfo } from '../../components/Documents/Documents';

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
    const { properties, children, childOnly, title, printTemplates } = contentType;
    const actualProperties: PropertySchema[] = properties.map(contentTypeProperty => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeProperty.name);

      return { ...schemaProperty, ...contentTypeProperty } as PropertySchema;
    });

    Object.assign(clonedSchema, { title, properties: actualProperties, children, childOnly, printTemplates });
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

    if (oldField.valueType === ValueType.GEOMETRY) {
      field.propertyType = PropertyType.GEOMETRY;
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

export const defaultValueWellKnownFormulas: Record<string, DefaultValueFormula> = {
  inherit: (obj, property, parent) => parent[property.name],
  parentDocument: (obj, property, parent: LibraryRecord) => {
    const value: DocumentInfo[] = [{ id: parent.id, libraryId: parent.libraryId, title: parent.title }];

    return JSON.stringify(value);
  }
};
