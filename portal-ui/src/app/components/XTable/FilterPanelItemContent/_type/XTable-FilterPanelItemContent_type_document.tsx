import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { type FilterQuery } from '../../../../services/util/filters/filters.models';
import {
  cnXTableFilterPanelItemContent,
  type XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeDocument = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.DOCUMENT }, XTableFilterPanelItemContentBase => props => {
  const { filter, col } = props;
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;
  const value = <>{filterValue?.$ilike as string}</>;

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
});
