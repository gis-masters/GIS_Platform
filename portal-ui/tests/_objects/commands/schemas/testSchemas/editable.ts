import { Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { testSorting } from './testSorting';

export const editable: Schema = {
  ...testSorting,
  name: 'editable',
  title: 'В режиме редактирования',
  tableName: 'editable'
};
