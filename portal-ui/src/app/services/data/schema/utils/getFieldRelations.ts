import { type Relation, type Schema, type SimpleSchema } from '../schema.models';

export function getFieldRelations(field: string | number, schema: Schema | SimpleSchema): Relation[] {
  return schema?.relations?.filter(relation => relation.property === field) || [];
}
