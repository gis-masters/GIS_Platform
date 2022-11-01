import { compose } from '@bem-react/core';

import { XTableFilterPanelItemContentBase } from './XTable-FilterPanelItemContent.base';
import { withTypeBool } from './_type/XTable-FilterPanelItemContent_type_bool';
import { withTypeChoice } from './_type/XTable-FilterPanelItemContent_type_choice';
import { withTypeDate } from './_type/XTable-FilterPanelItemContent_type_datetime';
import { withTypeDocument } from './_type/XTable-FilterPanelItemContent_type_document';
import { withTypeFloat } from './_type/XTable-FilterPanelItemContent_type_float';
import { withTypeInt } from './_type/XTable-FilterPanelItemContent_type_int';
import { withTypeString } from './_type/XTable-FilterPanelItemContent_type_string';

export const XTableFilterPanelItemContent = compose(
  withTypeString,
  withTypeDate,
  withTypeInt,
  withTypeFloat,
  withTypeDocument,
  withTypeBool,
  withTypeChoice
)(XTableFilterPanelItemContentBase) as typeof XTableFilterPanelItemContentBase;
