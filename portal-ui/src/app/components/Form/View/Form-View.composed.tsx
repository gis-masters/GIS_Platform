import { FormControlProps } from '@mui/material';
import { compose, HOC } from '@bem-react/core';

import { withTypeBinary } from './_type/Form-View_type_binary';
import { withTypeBool } from './_type/Form-View_type_bool';
import { withTypeChoice } from './_type/Form-View_type_choice';
import { withTypeCustom } from './_type/Form-View_type_custom';
import { withTypeDatetime } from './_type/Form-View_type_datetime';
import { withTypeDocument } from './_type/Form-View_type_document';
import { withTypeFias } from './_type/Form-View_type_fias';
import { withTypeFile } from './_type/Form-View_type_file';
import { withTypeFloat } from './_type/Form-View_type_float';
import { withTypeSet } from './_type/Form-View_type_set';
import { withTypeString } from './_type/Form-View_type_string';
import { withTypeUrl } from './_type/Form-View_type_url';
import { withTypeUser } from './_type/Form-View_type_user';
import { withTypeUserId } from './_type/Form-View_type_userId';
import { FormViewBase } from './Form-View.base';

export const FormView = compose(
  withTypeBool as HOC<FormControlProps>,
  withTypeBinary as HOC<FormControlProps>,
  withTypeChoice as HOC<FormControlProps>,
  withTypeCustom as HOC<FormControlProps>,
  withTypeDatetime as HOC<FormControlProps>,
  withTypeDocument as HOC<FormControlProps>,
  withTypeFloat as HOC<FormControlProps>,
  withTypeFias as HOC<FormControlProps>,
  withTypeFile as HOC<FormControlProps>,
  withTypeUser as HOC<FormControlProps>,
  withTypeUserId as HOC<FormControlProps>,
  withTypeSet as HOC<FormControlProps>,
  withTypeString as HOC<FormControlProps>,
  withTypeUrl as HOC<FormControlProps>
)(FormViewBase) as typeof FormViewBase;
