import { compose, HOC } from '@bem-react/core';

import { withTypeBool } from './_type/XTable-FilterPanelItemContent_type_bool';
import { withTypeChoice } from './_type/XTable-FilterPanelItemContent_type_choice';
import { withTypeDate } from './_type/XTable-FilterPanelItemContent_type_datetime';
import { withTypeDocument } from './_type/XTable-FilterPanelItemContent_type_document';
import { withTypeFias } from './_type/XTable-FilterPanelItemContent_type_fias';
import { withTypeFloat } from './_type/XTable-FilterPanelItemContent_type_float';
import { withTypeId } from './_type/XTable-FilterPanelItemContent_type_id';
import { withTypeInt } from './_type/XTable-FilterPanelItemContent_type_int';
import { withTypeLong } from './_type/XTable-FilterPanelItemContent_type_long';
import { withTypeString } from './_type/XTable-FilterPanelItemContent_type_string';
import { withTypeUserId } from './_type/XTable-FilterPanelItemContent_type_userId';
import {
  XTableFilterPanelItemContentBase,
  XTableFilterPanelItemContentProps
} from './XTable-FilterPanelItemContent.base';

export const XTableFilterPanelItemContent = compose(
  withTypeString as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeFias as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeDate as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeId as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeInt as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeLong as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeFloat as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeDocument as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeUserId as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeBool as HOC<XTableFilterPanelItemContentProps<unknown>>,
  withTypeChoice as HOC<XTableFilterPanelItemContentProps<unknown>>
)(XTableFilterPanelItemContentBase) as typeof XTableFilterPanelItemContentBase;
