import { type SchemaTemplateProjection } from '../../../../server-types/common-contracts';
import { type Schema } from '../schema/schema.models';
import { type OldSchema } from '../schema/schemaOld.models';

export interface SchemaTemplateWithOldSchema extends Omit<SchemaTemplateProjection, 'classRule'> {
  classRule: OldSchema;
}

export interface SchemaTemplate extends Omit<SchemaTemplateProjection, 'classRule'> {
  classRule: Schema;
}
