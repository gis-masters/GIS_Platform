import { cloneDeep } from 'lodash';
import { FeatureDescription, PropertySchema } from './schema.models';

export function getSchemaWithAppliedContentType(schema: FeatureDescription, contentTypeId: string): FeatureDescription {
  const clonedSchema: FeatureDescription = cloneDeep(schema);

  const contentType = clonedSchema.contentTypes.find(cType => cType.id === contentTypeId);
  if (contentType) {
    const actualProperties: PropertySchema[] = contentType.attributes.map(contentTypeDescription => {
      const schemaProperty = clonedSchema.properties.find(property => property.name === contentTypeDescription.name);

      return { ...schemaProperty, ...contentTypeDescription };
    });

    clonedSchema.properties = [...actualProperties];
  }

  return clonedSchema;
}
