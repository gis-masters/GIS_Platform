import { compose } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-Filter_type_bool';
import { withTypeChoice } from './_type/XTable-Filter_type_choice';
import { withTypeDateTime } from './_type/XTable-Filter_type_dateTime';
import { withTypeFloat } from './_type/XTable-Filter_type_float';
import { withTypeId } from './_type/XTable-Filter_type_id';
import { withTypeInteger } from './_type/XTable-Filter_type_integer';
import { withTypeString } from './_type/XTable-Filter_type_string';
import { XTableFilterBase } from './XTable-Filter.base';
import { withTypeDocument } from './_type/XTable-Filter_type_document';

export const XTableFilter = compose(
  withTypeBool,
  withTypeChoice,
  withTypeDateTime,
  withTypeFloat,
  withTypeId,
  withTypeInteger,
  withTypeDocument,
  withTypeString
)(XTableFilterBase) as typeof XTableFilterBase;
