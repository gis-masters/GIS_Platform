import React from 'react';
import { withBemMod } from '@bem-react/core';

import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { XTableExtraColumnType } from '../../XTable.models';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeId = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: XTableExtraColumnType.ID }, XTableFilterPanelItemContentBase => props => {
  const { filter, col } = props;
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;
  const value = <>{(filterValue?.$in as number[])?.join(', ')}</>;

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
});
