import { compose } from '@bem-react/core';

import { withTypeChoice } from './_type/Form-Control_type_CHOICE';
import { withTypeInt } from './_type/Form-Control_type_INT';
import { withTypeText } from './_type/Form-Control_type_TEXT';
import { withTypeString } from './_type/Form-Control_type_STRING';
import { withTypeBinary } from './_type/Form-Control_type_BINARY';
import { FormControl as Presenter } from './Form-Control';

export const FormControl = compose(
  withTypeString,
  withTypeInt,
  withTypeText,
  withTypeChoice,
  withTypeBinary
)(Presenter);
