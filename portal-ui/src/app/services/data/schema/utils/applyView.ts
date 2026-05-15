import { type Schema } from '../schema.models';
import { applyTypeToSchema } from './applyTypeToSchema';

export function applyView(schema: Schema, viewId?: string): Schema {
  const view = schema.views?.find(cType => cType.id === viewId);
  const resultSchema = applyTypeToSchema(schema, view);

  if (view) {
    resultSchema.appliedView = view.id;
  }

  return resultSchema;
}
