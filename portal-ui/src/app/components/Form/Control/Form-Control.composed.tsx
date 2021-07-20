import { compose } from '@bem-react/core';

import { withTypeInt } from './_type/Form-Control_type_INT';
import { withTypeText } from './_type/Form-Control_type_TEXT';
import { withTypeString } from './_type/Form-Control_type_STRING';
import { withTypeChoice } from './_type/Form-Control_type_CHOICE';
import { withTypeBinary } from './_type/Form-Control_type_BINARY';
import { withTypeCheckbox } from './_type/Form-Control_type_CHECKBOX';
import { withTypeCustom } from './_type/Form-Control_type_CUSTOM';
import { withTypeSet } from './_type/Form-Control_type_SET';
import { FormControl as Presenter } from './Form-Control';

export const FormControl = compose(
  withTypeInt,
  withTypeText,
  withTypeString,
  withTypeChoice,
  withTypeBinary,
  withTypeCheckbox,
  withTypeCustom,
  withTypeSet
)(Presenter);
