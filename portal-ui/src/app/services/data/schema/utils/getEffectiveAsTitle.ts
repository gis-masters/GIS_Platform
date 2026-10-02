import { type Schema } from '../schema.models';

function findAsTitleName(properties: { name?: string; asTitle?: boolean }[]): string | undefined {
  return properties.find(property => property.asTitle === true)?.name;
}

function findType(schema: Schema, contentTypeId?: string, viewId?: string) {
  if (viewId) {
    return schema.views?.find(view => view.id === viewId);
  }

  if (contentTypeId) {
    return schema.contentTypes?.find(contentType => contentType.id === contentTypeId);
  }
}

export function getEffectiveAsTitle(schema: Schema, contentTypeId?: string, viewId?: string): string | undefined {
  const type = findType(schema, contentTypeId, viewId);

  if (!type) {
    return findAsTitleName(schema.properties);
  }

  const ownTitle = findAsTitleName(type.properties);

  if (ownTitle) {
    return ownTitle;
  }

  const overriddenFalse = new Set(
    type.properties.filter(property => property.asTitle === false && property.name).map(property => property.name)
  );

  return schema.properties.find(property => property.asTitle === true && !overriddenFalse.has(property.name))?.name;
}
