import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type ContentType, type PropertySchema, type Schema } from '../schema.models';
import { type OldContentType, type OldPropertySchema, type OldSchema } from '../schemaOld.models';

function getNameFromFeatureKeys(name: string, feature?: WfsFeature): string {
  return (
    Object.keys(feature?.properties || {}).find(key => key.toLowerCase() === name.toLowerCase()) || name.toLowerCase()
  );
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
