import { type Schema } from '../schema.models';
import { applyTypeToSchema } from './applyTypeToSchema';

export function applyContentType(schema: Schema, contentTypeId?: string): Schema {
  const contentType = schema.contentTypes?.find(cType => cType.id === contentTypeId);
  const resultSchema = applyTypeToSchema(schema, contentType);

  if (contentType) {
    resultSchema.appliedContentType = contentType.id;
  }

  return resultSchema;
}
