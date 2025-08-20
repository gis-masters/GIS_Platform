import { cloneDeep } from 'lodash';

import { getIdsFromPath } from '../../../components/DataManagement/DataManagement.utils';
import { DocumentInfo } from '../../../components/Documents/Documents';
import { Attribute } from '../../geoserver/featureType/featureType.model';
import { GeometryType, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { convertComplexNamesArrayToTableNamesUriFragment } from '../../gis/layers/layers.utils';
import { services } from '../../services';
import { formatDate } from '../../util/date.util';
import { FilterQuery } from '../../util/filters/filters.models';
import { FileInfo } from '../files/files.models';
import { LibraryRecord } from '../library/library.models';
import {
  ContentType,
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaGeometry,
  PropertySchemaInt,
  PropertySchemaSet,
  PropertySchemaString,
  PropertySchemaUrl,
  PropertyType,
  Relation,
  Schema,
  SimpleSchema,
  ValueFormula
} from './schema.models';
import {
  OldContentType,
  OldPropertySchema,
  OldPropertySchemaChoice,
  OldPropertySchemaDatetime,
  OldPropertySchemaDouble,
  OldPropertySchemaSet,
  OldPropertySchemaString,
  OldPropertySchemaUrl,
  OldSchema,
  ValueType
} from './schemaOld.models';

export function applyViewOld(schema: OldSchema, viewId?: string): OldSchema {
  const view = schema.views?.find(cType => cType.id === viewId);

  return applyTypeToSchemaOld(schema, view);
}

function applyTypeToSchemaOld(schema: OldSchema, type: OldContentType | undefined): OldSchema {
  const clonedSchema = cloneDeep(schema);

  if (type) {
    const {
      attributes,
      styleName = clonedSchema.styleName,
      children = clonedSchema.children,
      childOnly = clonedSchema.childOnly,
      printTemplates = clonedSchema.printTemplates,
      relations = clonedSchema.relations,
      definitionQuery = clonedSchema.definitionQuery
    } = type;
    const actualProperties: OldPropertySchema[] = attributes.map(contentTypeProperty => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeProperty.name);

      return {
        ...schemaProperty,
        ...contentTypeProperty
      } as OldPropertySchema;
    });

    Object.assign(clonedSchema, {
      properties: actualProperties,
      children,
      childOnly,
      printTemplates,
      styleName,
      relations,
      definitionQuery
    });

    delete clonedSchema.views;
    delete clonedSchema.contentTypes;

    for (const [key, value] of Object.entries(clonedSchema)) {
      if (value === undefined) {
        delete clonedSchema[key as keyof typeof clonedSchema];
      }
    }
  }

  return clonedSchema;
}

export function applyView(schema: Schema, viewId?: string): Schema {
  const view = schema.views?.find(cType => cType.id === viewId);
  const resultSchema = applyTypeToSchema(schema, view);

  if (view) {
    resultSchema.appliedView = view.id;
  }

  return resultSchema;
}

export function applyContentType(schema: Schema, contentTypeId?: string): Schema {
  const contentType = schema.contentTypes?.find(cType => cType.id === contentTypeId);
  const resultSchema = applyTypeToSchema(schema, contentType);

  if (contentType) {
    resultSchema.appliedContentType = contentType.id;
  }

  return resultSchema;
}

export function mergeContentTypes(schema: Schema, contentTypeIds: string[]): ContentType {
  const properties: Partial<PropertySchema>[] = [];

  if (!schema.contentTypes?.length) {
    throw new Error('Нет типов для объединения');
  }

  for (const contentType of schema.contentTypes) {
    if (contentTypeIds.includes(contentType.id)) {
      const contentTypeProps = contentType.properties.filter(
        prop => !properties.some(({ name }) => name === prop.name)
      );

      properties.push(...contentTypeProps);
    }
  }

  return {
    properties,
    id: 'merged__' + contentTypeIds.join('__'),
    title: `Объединённый тип: "${contentTypeIds.join('", "')}"`,
    type: schema.contentTypes?.[0].type
  };
}

function applyTypeToSchema(schema: Schema, type: ContentType | undefined): Schema {
  if (schema.appliedView || schema.appliedContentType) {
    throw new Error('К схеме уже применен тип или представление');
  }

  const clonedSchema = cloneDeep(schema);

  if (type) {
    const {
      title,
      properties,
      styleName = clonedSchema.styleName,
      children = clonedSchema.children,
      childOnly = clonedSchema.childOnly,
      printTemplates = clonedSchema.printTemplates,
      relations = clonedSchema.relations,
      definitionQuery = clonedSchema.definitionQuery
    } = type;
    const actualProperties: PropertySchema[] = properties.map(contentTypeProperty => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeProperty.name);

      return { ...schemaProperty, ...contentTypeProperty } as PropertySchema;
    });

    Object.assign(clonedSchema, {
      title,
      properties: actualProperties,
      styleName,
      children,
      childOnly,
      printTemplates,
      relations,
      definitionQuery
    });

    for (const [key, value] of Object.entries(clonedSchema)) {
      if (value === undefined) {
        delete clonedSchema[key as keyof typeof clonedSchema];
      }
    }
  }

  return clonedSchema;
}

export function convertOldToNewSchema({ properties, contentTypes, views, ...rest }: OldSchema): Schema {
  return {
    ...rest,
    properties: convertOldToNewProperties(properties),
    ...(contentTypes ? { contentTypes: contentTypes?.map(convertOldToNewContentType) } : {}),
    ...(views ? { views: views.map(convertOldToNewContentType) } : {})
  };
}

export function convertNewToOldSchema({ properties, contentTypes, views, ...rest }: Schema): OldSchema {
  return {
    ...rest,
    properties: convertNewToOldProperties(properties),
    ...(contentTypes ? { contentTypes: contentTypes?.map(convertNewToOldContentType) } : {}),
    ...(views ? { views: views?.map(convertNewToOldContentType) } : {})
  };
}

function convertOldToNewContentType(contentType: OldContentType): ContentType {
  const newContentType: ContentType & Partial<OldContentType> = {
    ...contentType,
    properties: convertOldToNewProperties(contentType.attributes as OldPropertySchema[])
  };

  delete newContentType.attributes;

  return newContentType;
}

function convertNewToOldContentType(contentType: ContentType): OldContentType {
  const oldContentType: OldContentType & Partial<ContentType> = {
    ...contentType,
    attributes: convertNewToOldProperties(contentType.properties as PropertySchema[])
  };

  delete oldContentType.properties;

  return oldContentType;
}

export function convertOldToNewProperty(oldField: OldPropertySchema): PropertySchema {
  return convertOldToNewProperties([oldField])[0];
}

export function convertOldToNewProperties(oldFields: OldPropertySchema[]): PropertySchema[] {
  return oldFields?.map(oldField => {
    const field: Partial<PropertySchema> = { ...oldField } as OldPropertySchema;

    if (oldField.valueType === ValueType.STRING) {
      field.propertyType = PropertyType.STRING;

      if (oldField.pattern) {
        (field as Partial<PropertySchemaString>).regex = oldField.pattern;
        delete (field as Partial<OldPropertySchemaString>).pattern;
      }

      if (oldField.patternDescription) {
        (field as Partial<PropertySchemaString>).regexErrorMessage = oldField.patternDescription;
        delete (field as Partial<OldPropertySchemaString>).patternDescription;
      }
    }

    if (oldField.objectIdentityOnUi !== undefined) {
      field.asTitle = field.asTitle ?? oldField.objectIdentityOnUi;
      delete (field as Partial<OldPropertySchemaDouble>).objectIdentityOnUi;
    }

    if (oldField.valueType === ValueType.DOUBLE) {
      field.propertyType = PropertyType.FLOAT;

      (field as Partial<PropertySchemaFloat>).precision = oldField.fractionDigits;
      delete (field as Partial<OldPropertySchemaDouble>).fractionDigits;
    }

    if (oldField.valueType === ValueType.TEXT) {
      field.propertyType = PropertyType.TEXT;
    }

    if (oldField.valueType === ValueType.INT) {
      field.propertyType = PropertyType.INT;
    }

    if (oldField.valueType === ValueType.LONG) {
      field.propertyType = PropertyType.LONG;
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
      delete (field as Partial<OldPropertySchemaDatetime>).dateFormat;
    }

    if (oldField.valueType === ValueType.CHOICE) {
      field.propertyType = PropertyType.CHOICE;

      (field as Partial<PropertySchemaChoice>).options = oldField.enumerations;
      delete (field as Partial<OldPropertySchemaChoice>).enumerations;
    }

    if (oldField.valueType === ValueType.URL) {
      field.propertyType = PropertyType.URL;
      if (oldField.displayMode) {
        (field as Partial<PropertySchemaUrl>).openIn = oldField.displayMode === 'in_popup' ? 'popup' : 'newTab';
        delete (field as Partial<OldPropertySchemaUrl>).displayMode;
      }
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

    if (oldField.valueType === ValueType.USER) {
      field.propertyType = PropertyType.USER;
    }

    if (oldField.valueType === ValueType.USER_ID) {
      field.propertyType = PropertyType.USER_ID;
    }

    if (oldField.valueType === ValueType.GEOMETRY) {
      field.propertyType = PropertyType.GEOMETRY;
    }

    if (oldField.valueType === ValueType.UUID) {
      field.propertyType = PropertyType.UUID;
    }

    delete (field as Partial<OldPropertySchema>).valueType;

    return field as PropertySchema;
  });
}

export function convertNewToOldProperties(newFields: PropertySchema[]): OldPropertySchema[] {
  return newFields.map(newField => {
    const field: Partial<OldPropertySchema> = {
      ...newField
    } as Partial<OldPropertySchema>;

    if (newField.propertyType === PropertyType.STRING) {
      field.valueType = ValueType.STRING;

      if (newField.regex) {
        (field as Partial<OldPropertySchemaString>).pattern = newField.regex;
        delete (field as Partial<PropertySchemaString>).regex;
      }

      if (newField.regexErrorMessage) {
        (field as Partial<OldPropertySchemaString>).patternDescription = newField.regexErrorMessage;
        delete (field as Partial<PropertySchemaString>).regexErrorMessage;
      }
    }

    if (newField.propertyType === PropertyType.FLOAT) {
      field.valueType = ValueType.DOUBLE;

      (field as Partial<OldPropertySchemaDouble>).fractionDigits = newField.precision;
      delete (field as Partial<PropertySchemaFloat>).precision;
    }

    if (newField.propertyType === PropertyType.TEXT) {
      field.valueType = ValueType.TEXT;
    }

    if (newField.propertyType === PropertyType.INT) {
      field.valueType = ValueType.INT;
    }

    if (newField.propertyType === PropertyType.LONG) {
      field.valueType = ValueType.LONG;
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
      delete (field as Partial<PropertySchemaDatetime>).format;
    }

    if (newField.propertyType === PropertyType.CHOICE) {
      field.valueType = ValueType.CHOICE;

      (field as Partial<OldPropertySchemaChoice>).enumerations = newField.options;
      delete (field as Partial<PropertySchemaChoice>).options;
    }

    if (newField.propertyType === PropertyType.URL) {
      field.valueType = ValueType.URL;

      if (newField.openIn) {
        (field as Partial<OldPropertySchemaUrl>).displayMode = newField.openIn === 'popup' ? 'in_popup' : 'newTab';
      } else {
        (field as Partial<OldPropertySchemaUrl>).displayMode = undefined;
      }
      delete (field as Partial<PropertySchemaUrl>).openIn;
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

    if (newField.propertyType === PropertyType.USER) {
      field.valueType = ValueType.USER;
    }

    if (newField.propertyType === PropertyType.USER_ID) {
      field.valueType = ValueType.USER_ID;
    }

    if (newField.propertyType === PropertyType.GEOMETRY) {
      field.valueType = ValueType.GEOMETRY;
    }

    if (newField.propertyType === PropertyType.UUID) {
      field.valueType = ValueType.UUID;
    }

    delete (field as Partial<PropertySchema>).propertyType;

    return field as OldPropertySchema;
  });
}

export const valueWellKnownFormulas: Record<string, ValueFormula> = {
  inherit: (obj, property, parent) => (parent as Record<string, unknown>)[property.name],

  parentDocument: (obj, property, parent: unknown) => {
    const { libraryTableName, id, title } = parent as LibraryRecord;
    const value: DocumentInfo[] = [{ id, title, libraryTableName }];

    return JSON.stringify(value);
  },

  relationLink: (obj, { valueFormulaParams = {} }) =>
    JSON.stringify({
      url:
        `/data-management/library/${String(valueFormulaParams.library)}/registry?filter=` +
        encodeURI(
          JSON.stringify({
            applicant_name: {
              $ilike: `%${String((obj as Record<string, unknown>)[valueFormulaParams.property as string])}%`
            }
          })
        ),
      text: valueFormulaParams.text
    }),

  linkToFeaturesMentioningThisDocument: (obj, { valueFormulaParams = {} }) => {
    const { id, libraryTableName, path } = obj as LibraryRecord;
    const {
      projectId,
      property,
      layers,
      text = 'Связанные объекты',
      includeParents = false
    } = valueFormulaParams as {
      projectId: number;
      property: string;
      layers: string[];
      text?: string;
      includeParents?: boolean;
    };

    const ids: number[] = [id];
    if (includeParents) {
      ids.push(...getIdsFromPath(path));
    }

    const parts = ids
      .map(
        currId =>
          `(${property}%20LIKE%20%27%25{%22id%22:${currId},%25%22libraryTableName%22:%22${libraryTableName}%22%25%27)`
      )
      .join(')%20OR%20(');

    const ps = ids.length > 1 ? '()' : [0, 0];
    const filter = `${ps[0]}${parts}${ps[1]}`;

    if (!id || !libraryTableName) {
      return [];
    }

    return JSON.stringify([
      {
        url: `/projects/${projectId}/map?queryLayers=${convertComplexNamesArrayToTableNamesUriFragment(layers)}&queryFilter=${filter}`,
        text
      }
    ]);
  },

  linkToDocumentsMentioningThisDocument: (obj, { valueFormulaParams = {} }) => {
    const { id, libraryTableName, path } = obj as LibraryRecord;
    const {
      library,
      property,
      text = 'Связанные документы',
      includeParents = false
    } = valueFormulaParams as {
      library: number;
      property: string;
      text?: string;
      includeParents?: boolean;
    };
    const pathname = `/data-management/library/${library}/registry`;
    const ids: number[] = [id];
    if (includeParents) {
      ids.push(...getIdsFromPath(path));
    }

    const parts: FilterQuery[] = ids.map(currId => ({
      [property]: {
        $ilike: `%{"id":${currId},%"libraryTableName":"${libraryTableName}"%`
      }
    }));
    const filter: string = encodeURI(JSON.stringify(parts.length === 1 ? parts[0] : { $or: parts }));

    if (!id || !libraryTableName) {
      return [];
    }

    return JSON.stringify([
      {
        url: `${pathname}?filter=${filter}`,
        text
      }
    ]);
  }
};

export function getFieldRelations(field: string | number, schema: Schema | SimpleSchema): Relation[] {
  return schema?.relations?.filter(relation => relation.property === field) || [];
}

const valueToReadableTransformers: Partial<Record<PropertyType, (val: unknown, prop: PropertySchema) => string>> = {
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

  return String(value ?? '');
}

export function getGeometryFieldName(schema: Schema): string {
  const gProperty = schema.properties.find(prop => prop.propertyType === PropertyType.GEOMETRY);
  if (!gProperty) {
    throw new Error(`В схеме: '${schema.name}' не найдено свойство с геометрией`);
  }

  return gProperty.name || 'shape';
}

export function changeSchemaNamesCaseByFeature<T extends Schema | OldSchema>(schema: T, feature?: WfsFeature): T {
  return {
    ...schema,
    properties: schema.properties.map((property: PropertySchema | OldPropertySchema) => ({
      ...property,
      name: getNameFromFeatureKeys(property.name, feature)
    })),
    contentTypes: schema.contentTypes?.map((contentType: ContentType | OldContentType) => ({
      ...contentType,
      properties: (
        ((contentType as ContentType).properties || (contentType as OldContentType).attributes) as (
          | PropertySchema
          | OldPropertySchema
        )[]
      ).map(property => ({
        ...property,
        name: getNameFromFeatureKeys(property.name, feature)
      }))
    }))
  };
}

export function convertGeoserverPropertiesToSchemaProperties(attributes: Attribute[] = []): PropertySchema[] {
  return attributes.map(attribute => {
    if (attribute.binding.includes('org.locationtech.jts.geom')) {
      return {
        name: attribute.name,
        title: 'Геометрия',
        propertyType: PropertyType.GEOMETRY
      } as PropertySchemaGeometry;
    }

    switch (attribute.binding) {
      case 'java.lang.String': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.STRING,
          maxLength: attribute.length
        } as PropertySchemaString;
      }
      case 'java.math.BigInteger':
      case 'java.lang.Long':
      case 'java.lang.Integer': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.INT
        } as PropertySchemaInt;
      }
      case 'java.lang.Double': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.FLOAT
        } as PropertySchemaFloat;
      }
      default: {
        services.logger.warn(`Unsupported attribute type: '${attribute.binding}' Handled as String`);

        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.STRING,
          maxLength: attribute.length
        } as PropertySchemaString;
      }
    }
  });
}

export function getGeometryTypeFromGeoserverAttributes(attributes: Attribute[] = []): GeometryType {
  const geometryAttribute = attributes.find(attribute => attribute.binding.includes('org.locationtech.jts.geom'));
  if (geometryAttribute) {
    if (geometryAttribute.binding.includes(GeometryType.LINE_STRING)) {
      return GeometryType.LINE_STRING;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_POLYGON)) {
      return GeometryType.MULTI_POLYGON;
    } else if (geometryAttribute.binding.includes(GeometryType.POLYGON)) {
      return GeometryType.POLYGON;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_POINT)) {
      return GeometryType.MULTI_POINT;
    } else if (geometryAttribute.binding.includes(GeometryType.POINT)) {
      return GeometryType.POINT;
    } else if (geometryAttribute.binding.includes(GeometryType.LINEAR_RING)) {
      return GeometryType.LINEAR_RING;
    } else if (geometryAttribute.binding.includes(GeometryType.GEOMETRY_COLLECTION)) {
      return GeometryType.GEOMETRY_COLLECTION;
    } else if (geometryAttribute.binding.includes(GeometryType.CIRCLE)) {
      return GeometryType.CIRCLE;
    } else if (geometryAttribute.binding.includes(GeometryType.MULTI_LINE_STRING)) {
      return GeometryType.MULTI_LINE_STRING;
    }

    services.logger.warn('Unknown geometry type: ', geometryAttribute.binding, attributes);

    return GeometryType.MULTI_POLYGON;
  }

  const error = 'Not any attributes with geometry';
  services.logger.error(error);
  throw new Error(error);
}

function getNameFromFeatureKeys(name: string, feature?: WfsFeature): string {
  return (
    Object.keys(feature?.properties || {}).find(key => key.toLowerCase() === name.toLowerCase()) || name.toLowerCase()
  );
}
