import React, { FC } from 'react';

import { PropertyType } from '../../../../services/data/schema.models';
import { formatDate } from '../../../../services/util/date.util';

import {
  XTableFilterPanelItemContentBase,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

interface DateIntFloatFilter {
  $gte: number | string;
  $lte: number | string;
}

export const FilterPanelItemContentTypeInterval: FC<XTableFilterPanelItemContentProps> = props => {
  const { filter, col } = props;
  const fieldFilter = filter[String(col.field)] as unknown as DateIntFloatFilter;
  const from =
    col.type === PropertyType.DATETIME ? formatDate(fieldFilter.$gte, col.settings?.format) : fieldFilter.$gte;
  const to = col.type === PropertyType.DATETIME ? formatDate(fieldFilter.$lte, col.settings?.format) : fieldFilter.$lte;

  const value = (
    <>
      {fieldFilter.$gte && 'от'} {from} {fieldFilter.$lte && 'до'} {to}
    </>
  );

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
};
