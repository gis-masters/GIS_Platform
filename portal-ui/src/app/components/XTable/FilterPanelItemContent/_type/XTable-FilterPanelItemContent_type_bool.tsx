import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import {
  cnXTableFilterPanelItemContent,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const withTypeBool = withBemMod<XTableFilterPanelItemContentProps, XTableFilterPanelItemContentProps>(
  cnXTableFilterPanelItemContent(),
  { type: PropertyType.BOOL },
  XTableFilterPanelItemContentBase => props => {
    const { filter, col } = props;
    const value = <>{(filter[String(col.field)] as boolean) === true ? 'да' : 'нет'}</>;

    return <XTableFilterPanelItemContentBase {...props} value={value} />;
  }
);
