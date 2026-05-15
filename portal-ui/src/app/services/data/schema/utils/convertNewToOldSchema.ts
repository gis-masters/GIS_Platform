import { type ContentType, type PropertySchema, type Schema } from '../schema.models';
import { type OldContentType, type OldSchema } from '../schemaOld.models';
import { convertNewToOldProperties } from './convertNewToOldProperties';

function convertNewToOldContentType(contentType: ContentType): OldContentType {
  const oldContentType: OldContentType & Partial<ContentType> = {
    ...contentType,
    attributes: convertNewToOldProperties(contentType.properties as PropertySchema[])
  };

  delete oldContentType.properties;

  return oldContentType;
}

export function convertNewToOldSchema({ properties, contentTypes, views, ...rest }: Schema): OldSchema {
  return {
    ...rest,
    properties: convertNewToOldProperties(properties),
    ...(contentTypes ? { contentTypes: contentTypes?.map(convertNewToOldContentType) } : {}),
    ...(views ? { views: views?.map(convertNewToOldContentType) } : {})
  };
}
