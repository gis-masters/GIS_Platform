import { compose } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-Filter_type_bool';
import { withTypeChoice } from './_type/XTable-Filter_type_choice';
import { withTypeDateTime } from './_type/XTable-Filter_type_dateTime';
import { withTypeFloat } from './_type/XTable-Filter_type_float';
import { XTableFilter as Presenter } from './XTable-Filter';

export const XTableFilter = compose(withTypeBool, withTypeChoice, withTypeDateTime, withTypeFloat)(Presenter);
