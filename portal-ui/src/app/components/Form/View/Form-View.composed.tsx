import { compose } from '@bem-react/core';

import { withTypeBool } from './_type/Form-View_type_bool';
import { withTypeBinary } from './_type/Form-View_type_binary';
import { withTypeChoice } from './_type/Form-View_type_choice';
import { withTypeCustom } from './_type/Form-View_type_custom';
import { withTypeDatetime } from './_type/Form-View_type_datetime';
import { withTypeDocument } from './_type/Form-View_type_document';
import { withTypeFloat } from './_type/Form-View_type_float';
import { withTypeFias } from './_type/Form-View_type_fias';
import { withTypeFile } from './_type/Form-View_type_file';
import { withTypeSet } from './_type/Form-View_type_set';
import { withTypeUrl } from './_type/Form-View_type_url';
import { FormView as Presenter } from './Form-View';

export const FormView = compose(
  withTypeBool,
  withTypeBinary,
  withTypeChoice,
  withTypeCustom,
  withTypeDatetime,
  withTypeDocument,
  withTypeFloat,
  withTypeFias,
  withTypeFile,
  withTypeUrl,
  withTypeSet
)(Presenter);
