import { compose } from '@bem-react/core';

import { withTypeChoice } from './_type/XTable-Filter_type_choice';
import { withTypeDateTime } from './_type/XTable-Filter_type_dateTime';
import { withTypeFloat } from './_type/XTable-Filter_type_float';
import { XTableFilter as Presenter } from './XTable-Filter';

export const XTableFilter = compose(withTypeChoice, withTypeFloat, withTypeDateTime)(Presenter);
