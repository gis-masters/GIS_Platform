import { type PropertySchema } from '../schema.models';
import { type OldPropertySchema } from '../schemaOld.models';
import { convertOldToNewProperties } from './convertOldToNewProperties';

export function convertOldToNewProperty(oldField: OldPropertySchema): PropertySchema {
  return convertOldToNewProperties([oldField])[0];
}
