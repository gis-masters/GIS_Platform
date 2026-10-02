import { cloneDeep } from 'lodash';

import { type PropertySchema, type Schema } from '../schema.models';

function schemaHasAsTitleTrue(schema: Schema, propertyName: string): boolean {
  return schema.properties.some(property => property.name === propertyName && property.asTitle === true);
}

function withoutAsTitle<T extends Partial<PropertySchema>>(property: T): T {
  if (property.asTitle === undefined) {
    return property;
  }

  const { asTitle, ...propertyWithoutAsTitle } = property;

  return propertyWithoutAsTitle as T;
}

function applyAsTitleToRootProperties<T extends Partial<PropertySchema>>(
  properties: T[],
  fieldName: string | undefined
): T[] {
  return properties.map(property => {
    if (fieldName && property.name === fieldName) {
      return {
        ...property,
        asTitle: true
      };
    }

    return withoutAsTitle(property);
  });
}

function applyAsTitleToOverrideProperties<T extends Partial<PropertySchema>>(
  properties: T[],
  fieldName: string | undefined,
  schema: Schema
): T[] {
  return properties.map(property => {
    if (fieldName && property.name === fieldName) {
      return {
        ...property,
        asTitle: true
      };
    }

    if (property.name && schemaHasAsTitleTrue(schema, property.name)) {
      return {
        ...property,
        asTitle: false
      };
    }

    return withoutAsTitle(property);
  });
}

export function applyAsTitleToSchema(
  schema: Schema,
  fieldName?: string,
  contentTypeId?: string,
  viewId?: string
): Schema {
  const nextSchema = cloneDeep(schema);

  if (viewId) {
    nextSchema.views = nextSchema.views?.map(view =>
      view.id === viewId
        ? {
            ...view,
            properties: applyAsTitleToOverrideProperties(view.properties, fieldName, schema)
          }
        : view
    );

    return nextSchema;
  }

  if (contentTypeId) {
    nextSchema.contentTypes = nextSchema.contentTypes?.map(contentType =>
      contentType.id === contentTypeId
        ? {
            ...contentType,
            properties: applyAsTitleToOverrideProperties(contentType.properties, fieldName, schema)
          }
        : contentType
    );

    return nextSchema;
  }

  nextSchema.properties = applyAsTitleToRootProperties(nextSchema.properties, fieldName);

  return nextSchema;
}
