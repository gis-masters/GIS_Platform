import { compose } from '@bem-react/core';

import { withTypeBinary } from './_type/Form-Control_type_binary';
import { withTypeBool } from './_type/Form-Control_type_bool';
import { withTypeChoice } from './_type/Form-Control_type_choice';
import { withTypeCustom } from './_type/Form-Control_type_custom';
import { withTypeDatetime } from './_type/Form-Control_type_dateTime';
import { withTypeInt } from './_type/Form-Control_type_int';
import { withTypeSet } from './_type/Form-Control_type_set';
import { withTypeString } from './_type/Form-Control_type_string';
import { withTypeFloat } from './_type/Form-Control_type_float';
import { withTypeFias } from './_type/Form-Control_type_fias';
import { withTypeUrl } from './_type/Form-Control_type_url';

import { FormControl as Presenter } from './Form-Control';

export const FormControl = compose(
  withTypeInt,
  withTypeFloat,
  withTypeString,
  withTypeChoice,
  withTypeBinary,
  withTypeBool,
  withTypeCustom,
  withTypeSet,
  withTypeFias,
  withTypeUrl,
  withTypeDatetime
)(Presenter);
