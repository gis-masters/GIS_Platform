import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';
import { FilterPanelItemContentTypeInterval } from './XTable-FilterPanelItemContent_type_interval';

export const withTypeInt = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.INT }, () => props => {
  return <FilterPanelItemContentTypeInterval {...props} />;
});
