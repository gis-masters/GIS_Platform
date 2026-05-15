import { type ContentType, type PropertySchema, type Schema } from '../schema.models';

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
