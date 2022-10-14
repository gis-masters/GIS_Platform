import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

interface StringFilter {
  $ilike: string;
}

export const withTypeString = withBemMod<XTableFilterPanelItemContentProps, XTableFilterPanelItemContentProps>(
  cnXTableFilterPanelItemContent(),
  { type: PropertyType.STRING },
  XTableFilterPanelItemContentBase => props => {
    const { filter, col } = props;
    const value = <>{(filter[String(col.field)] as unknown as StringFilter).$ilike}</>;

    return <XTableFilterPanelItemContentBase {...props} value={value} />;
  }
);
