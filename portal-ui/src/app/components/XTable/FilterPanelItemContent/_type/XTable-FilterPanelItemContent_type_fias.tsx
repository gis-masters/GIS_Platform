import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeFias = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.FIAS }, XTableFilterPanelItemContentBase => props => {
  const { filter, col } = props;
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;

  const value = <>{filterValue?.$ilike}</>;

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
});
