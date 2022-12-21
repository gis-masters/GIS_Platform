import { compose } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-CellContent_type_bool';
import { withTypeChoice } from './_type/XTable-CellContent_type_choice';
import { withTypeDateTime } from './_type/XTable-CellContent_type_dateTime';
import { withTypeDocument } from './_type/XTable-CellContent_type_document';
import { withTypeFile } from './_type/XTable-CellContent_type_file';
import { withTypeFias } from './_type/XTable-CellContent_type_fias';
import { withTypeUrl } from './_type/XTable-CellContent_type_url';
import { XTableCellContentBase as Presenter } from './XTable-CellContent.base';

export const XTableCellContent = compose(
  withTypeBool,
  withTypeChoice,
  withTypeDateTime,
  withTypeDocument,
  withTypeFile,
  withTypeFias,
  withTypeUrl
)(Presenter) as typeof Presenter;
