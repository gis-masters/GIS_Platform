import { Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './allTypes';

export const allTypesReadonly: Schema = {
  ...allTypes,
  name: 'allTypesReadonly',
  title: 'Все типы данных в режиме чтения',
  tableName: 'all_types_readonly',
  readOnly: true
};
