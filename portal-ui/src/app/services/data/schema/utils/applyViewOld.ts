import { cloneDeep } from 'lodash';

import { type OldContentType, type OldPropertySchema, type OldSchema } from '../schemaOld.models';

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
