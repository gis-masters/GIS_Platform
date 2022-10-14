import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

interface ChoiceFilter {
  $in: string[];
}

export const withTypeChoice = withBemMod<XTableFilterPanelItemContentProps, XTableFilterPanelItemContentProps>(
  cnXTableFilterPanelItemContent(),
  { type: PropertyType.CHOICE },
  XTableFilterPanelItemContentBase => props => {
    const { filter, col } = props;
    const options = col.settings.options;
    const choiceValues = (filter[String(col.field)] as unknown as ChoiceFilter)?.$in;
    const choiceTitles = choiceValues
      ?.map(value => {
        return options.find(option => option.value === value).title;
      })
      .join(', ');
    const value = filter[String(col.field)] === null ? <>Не заполнено</> : <>{choiceTitles}</>;

    return <XTableFilterPanelItemContentBase {...props} value={value} />;
  }
);
