import { FormControlProps } from '@mui/material';
import { compose, HOC } from '@bem-react/core';

import { withTypeBinary } from './_type/Form-Control_type_binary';
import { withTypeBool } from './_type/Form-Control_type_bool';
import { withTypeChoice } from './_type/Form-Control_type_choice';
import { withTypeCustom } from './_type/Form-Control_type_custom';
import { withTypeDatetime } from './_type/Form-Control_type_dateTime';
import { withTypeDocument } from './_type/Form-Control_type_document';
import { withTypeFias } from './_type/Form-Control_type_fias';
import { withTypeFile } from './_type/Form-Control_type_file';
import { withTypeFloat } from './_type/Form-Control_type_float';
import { withTypeInt } from './_type/Form-Control_type_int';
import { withTypeLong } from './_type/Form-Control_type_long';
import { withTypeSet } from './_type/Form-Control_type_set';
import { withTypeString } from './_type/Form-Control_type_string';
import { withTypeText } from './_type/Form-Control_type_text';
import { withTypeUrl } from './_type/Form-Control_type_url';
import { withTypeUser } from './_type/Form-Control_type_user';
import { withTypeUserId } from './_type/Form-Control_type_userId';
import { FormControl as Presenter } from './Form-Control';

export const FormControl = compose(
  withTypeInt as HOC<FormControlProps>,
  withTypeLong as HOC<FormControlProps>,
  withTypeFloat as HOC<FormControlProps>,
  withTypeText as HOC<FormControlProps>,
  withTypeString as HOC<FormControlProps>,
  withTypeChoice as HOC<FormControlProps>,
  withTypeBinary as HOC<FormControlProps>,
  withTypeBool as HOC<FormControlProps>,
  withTypeCustom as HOC<FormControlProps>,
  withTypeSet as HOC<FormControlProps>,
  withTypeFias as HOC<FormControlProps>,
  withTypeFile as HOC<FormControlProps>,
  withTypeDocument as HOC<FormControlProps>,
  withTypeUrl as HOC<FormControlProps>,
  withTypeUser as HOC<FormControlProps>,
  withTypeUserId as HOC<FormControlProps>,
  withTypeDatetime as HOC<FormControlProps>
)(Presenter) as typeof Presenter;
