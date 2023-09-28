import { HOC, compose } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-Filter_type_bool';
import { withTypeChoice } from './_type/XTable-Filter_type_choice';
import { withTypeDateTime } from './_type/XTable-Filter_type_dateTime';
import { withTypeFloat } from './_type/XTable-Filter_type_float';
import { withTypeId } from './_type/XTable-Filter_type_id';
import { withTypeInteger } from './_type/XTable-Filter_type_integer';
import { withTypeString } from './_type/XTable-Filter_type_string';
import { XTableFilterBase, XTableFilterProps } from './XTable-Filter.base';
import { withTypeDocument } from './_type/XTable-Filter_type_document';
import { withTypeUserId } from './_type/XTable-Filter_type_userId';
import { withTypeUser } from './_type/XTable-Filter_type_user';

export const XTableFilter = compose(
  withTypeBool as HOC<XTableFilterProps>,
  withTypeChoice as HOC<XTableFilterProps>,
  withTypeDateTime as HOC<XTableFilterProps>,
  withTypeFloat as HOC<XTableFilterProps>,
  withTypeId as HOC<XTableFilterProps>,
  withTypeInteger as HOC<XTableFilterProps>,
  withTypeDocument as HOC<XTableFilterProps>,
  withTypeUserId as HOC<XTableFilterProps>,
  withTypeUser as HOC<XTableFilterProps>,
  withTypeString as HOC<XTableFilterProps>
)(XTableFilterBase) as typeof XTableFilterBase;
