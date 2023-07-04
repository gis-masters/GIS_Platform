import { Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { testNotSorting } from './testNotSorting';

export const readonly: Schema = {
  ...testNotSorting,
  name: 'readonly',
  title: 'В режиме чтения',
  tableName: 'readonly'
};
