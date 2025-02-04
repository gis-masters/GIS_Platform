import { compose, HOC } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-CellContent_type_bool';
import { withTypeChoice } from './_type/XTable-CellContent_type_choice';
import { withTypeDateTime } from './_type/XTable-CellContent_type_dateTime';
import { withTypeDocument } from './_type/XTable-CellContent_type_document';
import { withTypeFias } from './_type/XTable-CellContent_type_fias';
import { withTypeFile } from './_type/XTable-CellContent_type_file';
import { withTypeFloat } from './_type/XTable-CellContent_type_float';
import { withTypeUrl } from './_type/XTable-CellContent_type_url';
import { withTypeUser } from './_type/XTable-CellContent_type_user';
import { withTypeUserId } from './_type/XTable-CellContent_type_userId';
import { XTableCellContentBase as Presenter, XTableCellContentProps } from './XTable-CellContent.base';

export const XTableCellContent = compose(
  withTypeBool as HOC<XTableCellContentProps<unknown>>,
  withTypeChoice as HOC<XTableCellContentProps<unknown>>,
  withTypeDateTime as HOC<XTableCellContentProps<unknown>>,
  withTypeDocument as HOC<XTableCellContentProps<unknown>>,
  withTypeFloat as HOC<XTableCellContentProps<unknown>>,
  withTypeFile as HOC<XTableCellContentProps<unknown>>,
  withTypeFias as HOC<XTableCellContentProps<unknown>>,
  withTypeUserId as HOC<XTableCellContentProps<unknown>>,
  withTypeUser as HOC<XTableCellContentProps<unknown>>,
  withTypeUrl as HOC<XTableCellContentProps<unknown>>
)(Presenter) as typeof Presenter;
