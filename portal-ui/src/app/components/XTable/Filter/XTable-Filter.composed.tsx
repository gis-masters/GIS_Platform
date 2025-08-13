import { compose, HOC } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-Filter_type_bool';
import { withTypeChoice } from './_type/XTable-Filter_type_choice';
import { withTypeDateTime } from './_type/XTable-Filter_type_dateTime';
import { withTypeDocument } from './_type/XTable-Filter_type_document';
import { withTypeFias } from './_type/XTable-Filter_type_fias';
import { withTypeFloat } from './_type/XTable-Filter_type_float';
import { withTypeId } from './_type/XTable-Filter_type_id';
import { withTypeInteger } from './_type/XTable-Filter_type_integer';
import { withTypeLong } from './_type/XTable-Filter_type_long';
import { withTypeString } from './_type/XTable-Filter_type_string';
import { withTypeText } from './_type/XTable-Filter_type_text';
import { withTypeUser } from './_type/XTable-Filter_type_user';
import { withTypeUserId } from './_type/XTable-Filter_type_userId';
import { XTableFilterBase, XTableFilterProps } from './XTable-Filter.base';

export const XTableFilter = compose(
  withTypeBool as HOC<XTableFilterProps>,
  withTypeChoice as HOC<XTableFilterProps>,
  withTypeDateTime as HOC<XTableFilterProps>,
  withTypeFloat as HOC<XTableFilterProps>,
  withTypeId as HOC<XTableFilterProps>,
  withTypeInteger as HOC<XTableFilterProps>,
  withTypeLong as HOC<XTableFilterProps>,
  withTypeDocument as HOC<XTableFilterProps>,
  withTypeUserId as HOC<XTableFilterProps>,
  withTypeUser as HOC<XTableFilterProps>,
  withTypeString as HOC<XTableFilterProps>,
  withTypeText as HOC<XTableFilterProps>,
  withTypeFias as HOC<XTableFilterProps>
)(XTableFilterBase) as typeof XTableFilterBase;
