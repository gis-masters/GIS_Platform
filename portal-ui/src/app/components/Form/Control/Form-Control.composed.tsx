import { compose } from '@bem-react/core';

import { withTypeInt } from './_type/Form-Control_type_int';
import { withTypeString } from './_type/Form-Control_type_string';
import { withTypeChoice } from './_type/Form-Control_type_choice';
import { withTypeBinary } from './_type/Form-Control_type_binary';
import { withTypeBool } from './_type/Form-Control_type_bool';
import { withTypeCustom } from './_type/Form-Control_type_custom';
import { withTypeSet } from './_type/Form-Control_type_set';
import { FormControl as Presenter } from './Form-Control';

export const FormControl = compose(
  withTypeInt,
  withTypeString,
  withTypeChoice,
  withTypeBinary,
  withTypeBool,
  withTypeCustom,
  withTypeSet
)(Presenter);
