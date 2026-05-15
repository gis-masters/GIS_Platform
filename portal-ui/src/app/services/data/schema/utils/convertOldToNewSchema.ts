import { type ContentType, type Schema } from '../schema.models';
import { type OldContentType, type OldPropertySchema, type OldSchema } from '../schemaOld.models';
import { convertOldToNewProperties } from './convertOldToNewProperties';

function convertOldToNewContentType(contentType: OldContentType): ContentType {
  const newContentType: ContentType & Partial<OldContentType> = {
    ...contentType,
    properties: convertOldToNewProperties(contentType.attributes as OldPropertySchema[])
  };

  delete newContentType.attributes;

  return newContentType;
}

export function convertOldToNewSchema({ properties, contentTypes, views, ...rest }: OldSchema): Schema {
  return {
    ...rest,
    properties: convertOldToNewProperties(properties),
    ...(contentTypes ? { contentTypes: contentTypes?.map(convertOldToNewContentType) } : {}),
    ...(views ? { views: views.map(convertOldToNewContentType) } : {})
  };
}
