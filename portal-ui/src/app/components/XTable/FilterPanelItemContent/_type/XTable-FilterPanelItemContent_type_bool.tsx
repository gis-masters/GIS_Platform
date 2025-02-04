import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeBool = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.BOOL }, XTableFilterPanelItemContentBase => props => {
  const { filter, col } = props;
  const value = getFieldFilterValue(filter, col.field);

  return <XTableFilterPanelItemContentBase {...props} value={<>{value === true ? 'да' : 'нет'}</>} />;
});
