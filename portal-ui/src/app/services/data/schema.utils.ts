import { cloneDeep } from 'lodash';

import {
  OldSchema,
  OldPropertySchema,
  OldContentType,
  ValueType,
  OldPropertySchemaDouble,
  OldPropertySchemaDatetime,
  OldPropertySchemaChoice,
  OldPropertySchemaUrl,
  OldPropertySchemaSet
} from './schemaOld.models';
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
  Relation,
  PropertySchemaSet
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

      return { ...schemaProperty, ...contentTypeDescription } as OldPropertySchema;
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

export function convertOldToNewSchema({
  name,
  title,
  tableName,
  description,
  geometryType,
  readOnly,
  children,
  childOnly,
  printTemplates,
  relations,
  properties,
  contentTypes
}: OldSchema): Schema {
  return {
    name,
    title,
    tableName,
    description,
    geometryType,
    readOnly,
    children,
    childOnly,
    printTemplates,
    relations,
    properties: convertOldToNewProperties(properties),
    contentTypes: contentTypes.map(convertOldToNewContentType)
  };
}

export function convertNewToOldSchema({
  name,
  title,
  tableName,
  description,
  geometryType,
  readOnly,
  children,
  childOnly,
  printTemplates,
  relations,
  properties,
  contentTypes
}: Schema): OldSchema {
  return {
    name,
    title,
    tableName,
    description,
    geometryType,
    readOnly,
    children,
    childOnly,
    printTemplates,
    relations,
    properties: convertNewToOldProperties(properties),
    contentTypes: contentTypes.map(convertNewToOldContentType)
  };
}

function convertOldToNewContentType(contentType: OldContentType): ContentType {
  return {
    ...contentType,
    properties: convertOldToNewProperties(contentType.attributes as OldPropertySchema[])
  };
}

function convertNewToOldContentType(contentType: ContentType): OldContentType {
  return { ...contentType, attributes: convertNewToOldProperties(contentType.properties as PropertySchema[]) };
}

export function convertOldToNewProperties(oldFields: OldPropertySchema[]): PropertySchema[] {
  return oldFields.map(oldField => {
    const field: Partial<PropertySchema> = { ...oldField } as OldPropertySchema;

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
      (field as PropertySchema as PropertySchemaSet).propertyType = PropertyType.SET;
      (field as PropertySchema as PropertySchemaSet).properties = convertOldToNewProperties(
        (oldField as OldPropertySchema as OldPropertySchemaSet).properties
      );
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

    return field as PropertySchema;
  });
}

export function convertNewToOldProperties<T extends Record<string, unknown>>(
  newFields: PropertySchema<T>[]
): OldPropertySchema<T>[] {
  return newFields.map(newField => {
    const field: Partial<OldPropertySchema<T>> = { ...newField } as Partial<OldPropertySchema<T>>;

    if (newField.propertyType === PropertyType.STRING) {
      field.valueType = ValueType.STRING;

      field.description = String(newField.description);
    }

    field.objectIdentityOnUi = newField.asTitle;

    if (newField.propertyType === PropertyType.FLOAT) {
      field.valueType = ValueType.DOUBLE;

      (field as Partial<OldPropertySchemaDouble>).fractionDigits = newField.precision;
    }

    if (newField.propertyType === PropertyType.INT) {
      field.valueType = ValueType.INT;
    }

    if (newField.propertyType === PropertyType.BOOL) {
      field.valueType = ValueType.CHECKBOX;
    }

    if (newField.propertyType === PropertyType.BOOL) {
      field.valueType = ValueType.BOOLEAN;
    }

    if (newField.propertyType === PropertyType.DATETIME) {
      field.valueType = ValueType.DATETIME;

      (field as Partial<OldPropertySchemaDatetime>).dateFormat = newField.format;
    }

    if (newField.propertyType === PropertyType.CHOICE) {
      field.valueType = ValueType.CHOICE;

      (field as Partial<OldPropertySchemaChoice>).isMultiple = newField.multiple;

      (field as Partial<OldPropertySchemaChoice>).enumerations = newField.options;
    }

    if (newField.propertyType === PropertyType.URL) {
      field.valueType = ValueType.URL;

      (field as Partial<OldPropertySchemaUrl>).displayMode = 'in_popup';
    }

    if (newField.propertyType === PropertyType.LOOKUP) {
      field.valueType = ValueType.LOOKUP;
    }

    if (newField.propertyType === PropertyType.BINARY) {
      field.valueType = ValueType.BINARY;
    }

    if (newField.propertyType === PropertyType.SET) {
      field.valueType = ValueType.SET;
    }

    if (newField.propertyType === PropertyType.FIAS) {
      field.valueType = ValueType.FIAS;
    }

    if (newField.propertyType === PropertyType.FILE) {
      field.valueType = ValueType.FILE;
    }

    if (newField.propertyType === PropertyType.DOCUMENT) {
      field.valueType = ValueType.DOCUMENT;
    }

    delete (field as Partial<PropertySchema>).propertyType;

    return field as OldPropertySchema<T>;
  });
}

export const valueWellKnownFormulas: Record<string, ValueFormula> = {
  inherit: (obj, property, parent) => parent[property.name],

  parentDocument: (obj, property, parent: LibraryRecord) => {
    const value: DocumentInfo[] = [{ id: parent.id, libraryId: parent.libraryId, title: parent.title }];

    return JSON.stringify(value);
  },

  relationLink: (obj, { valueFormulaParams = {} }) =>
    JSON.stringify({
      url:
        `/data-management/library/${String(valueFormulaParams.library)}/registry?filter=` +
        encodeURI(
          JSON.stringify({ applicant_name: { $ilike: `%${String(obj[valueFormulaParams.property as string])}%` } })
        ),
      text: valueFormulaParams.text
    }),

  linkToFeaturesMentioningThisDocument: (obj: LibraryRecord, { valueFormulaParams = {} }) => {
    const {
      projectId,
      property,
      layers,
      text = 'Связанные объекты'
    } = valueFormulaParams as {
      projectId: number;
      property: string;
      layers: string[];
      text?: string;
    };
    const pathname = `/projects/${projectId}/map`;
    const filter = `${property}%20LIKE%20%27%25{%22id%22:${obj.id},%25%22libraryId%22:%22${obj.libraryId}%22%25%27`;

    if (!obj.id || !obj.libraryId) {
      return [];
    }

    return JSON.stringify([
      {
        url: `${pathname}?queryLayers=${layers.join(',')}&queryFilter=${filter}`,
        text
      }
    ]);
  }
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
      return (property as PropertySchemaChoice).options.find(option => option.value === value)?.title || String(value);
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
