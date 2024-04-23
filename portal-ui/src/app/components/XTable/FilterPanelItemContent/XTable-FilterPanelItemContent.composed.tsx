import { compose } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-FilterPanelItemContent_type_bool';
import { withTypeChoice } from './_type/XTable-FilterPanelItemContent_type_choice';
import { withTypeDate } from './_type/XTable-FilterPanelItemContent_type_datetime';
import { withTypeDocument } from './_type/XTable-FilterPanelItemContent_type_document';
import { withTypeFloat } from './_type/XTable-FilterPanelItemContent_type_float';
import { withTypeId } from './_type/XTable-FilterPanelItemContent_type_id';
import { withTypeInt } from './_type/XTable-FilterPanelItemContent_type_int';
import { withTypeString } from './_type/XTable-FilterPanelItemContent_type_string';
import { withTypeUserId } from './_type/XTable-FilterPanelItemContent_type_userId';
import { XTableFilterPanelItemContentBase } from './XTable-FilterPanelItemContent.base';

export const XTableFilterPanelItemContent = compose(
  withTypeString,
  withTypeDate,
  withTypeId,
  withTypeInt,
  withTypeFloat,
  withTypeDocument,
  withTypeUserId,
  withTypeBool,
  withTypeChoice
)(XTableFilterPanelItemContentBase) as typeof XTableFilterPanelItemContentBase;
