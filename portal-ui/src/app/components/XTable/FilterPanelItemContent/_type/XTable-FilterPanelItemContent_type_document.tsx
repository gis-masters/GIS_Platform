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

export const withTypeDocument = withBemMod<XTableFilterPanelItemContentProps, XTableFilterPanelItemContentProps>(
  cnXTableFilterPanelItemContent(),
  { type: PropertyType.DOCUMENT },
  XTableFilterPanelItemContentBase => props => {
    const { filter, col } = props;
    const value = <>{(filter[String(col.field)] as unknown as StringFilter).$ilike}</>;

    return <XTableFilterPanelItemContentBase {...props} value={value} />;
  }
);
