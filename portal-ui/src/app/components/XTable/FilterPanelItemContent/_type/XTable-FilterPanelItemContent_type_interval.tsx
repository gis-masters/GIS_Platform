import React, { ReactElement } from 'react';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { formatDate } from '../../../../services/util/date.util';
import { getFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import {
  XTableFilterPanelItemContentBase,
  XTableFilterPanelItemContentProps
} from '../XTable-FilterPanelItemContent.base';

export const FilterPanelItemContentTypeInterval = ((props: XTableFilterPanelItemContentProps<unknown>) => {
  const { filter, col } = props;
  const filterValue = getFieldFilterValue(filter, col.field) as FilterQuery;
  const from =
    col.type === PropertyType.DATETIME && filterValue?.$gte
      ? formatDate(filterValue?.$gte as string, col.settings?.format)
      : filterValue?.$gte;
  const to =
    col.type === PropertyType.DATETIME && filterValue?.$lte
      ? formatDate(filterValue?.$lte as string, col.settings?.format)
      : filterValue?.$lte;

  const value = (
    <>
      {(filterValue?.$gte || filterValue?.$gte === 0) && 'от'} {from}{' '}
      {(filterValue?.$lte || filterValue?.$lte === 0) && 'до'} {to}
    </>
  );

  return <XTableFilterPanelItemContentBase {...props} value={value} />;
}) as <T>(p: XTableFilterPanelItemContentProps<T>) => ReactElement;
