import { Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './allTypes';

export const allTypesEditable: Schema = {
  ...allTypes,
  name: 'allTypesEditable',
  title: 'Все типы данных редактируемые',
  tableName: 'all_types_editable'
};
