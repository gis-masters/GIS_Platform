import { cloneDeep } from 'lodash';

import { type ContentType, type PropertySchema, type Schema } from '../schema.models';

export function applyTypeToSchema(schema: Schema, type: ContentType | undefined): Schema {
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
