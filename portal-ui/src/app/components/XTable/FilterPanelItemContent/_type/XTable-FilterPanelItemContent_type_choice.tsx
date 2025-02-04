import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeChoice = withBemMod<
  XTableFilterPanelItemContentProps<unknown>,
  XTableFilterPanelItemContentProps<unknown>
>(cnXTableFilterPanelItemContent(), { type: PropertyType.CHOICE }, XTableFilterPanelItemContentBase => props => {
  const { filter, col } = props;
  const options = col.settings?.options || [];
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;
  const choiceValues = filterValue?.$in as string[];
  const choiceTitles = choiceValues
    ?.map(value => {
      return options.find(option => option.value === value)?.title;
    })
    .join(', ');
  const value = filterValue === null ? <>Не заполнено</> : <>{choiceTitles}</>;

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
});
