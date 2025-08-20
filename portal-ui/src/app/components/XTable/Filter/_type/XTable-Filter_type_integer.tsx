import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';
import { XTableFilterTypeNumber } from './XTable-Filter_type_number';

export const withTypeInteger = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.INT },
  () => XTableFilterTypeNumber
);
