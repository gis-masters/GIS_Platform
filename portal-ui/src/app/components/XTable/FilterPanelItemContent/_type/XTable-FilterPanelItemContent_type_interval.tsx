import React, { ReactElement } from 'react';

import { FilterQuery, getFieldFilterValue } from '../../../../services/util/filterObjects';
import { PropertyType } from '../../../../services/data/schema.models';
import { formatDate } from '../../../../services/util/date.util';

import {
  XTableFilterPanelItemContentBase,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const FilterPanelItemContentTypeInterval = ((props: XTableFilterPanelItemContentProps<unknown>) => {
  const { filter, col } = props;
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;
  const from =
    col.type === PropertyType.DATETIME
      ? formatDate(filterValue.$gte as string, col.settings?.format)
      : filterValue.$gte;
  const to =
    col.type === PropertyType.DATETIME
      ? formatDate(filterValue.$lte as string, col.settings?.format)
      : filterValue.$lte;

  const value = (
    <>
      {filterValue.$gte && 'от'} {from} {filterValue.$lte && 'до'} {to}
    </>
  );

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
}) as <T>(p: XTableFilterPanelItemContentProps<T>) => ReactElement;
