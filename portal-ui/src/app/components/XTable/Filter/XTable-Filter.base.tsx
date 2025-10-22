import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type PropertyOption } from '../../../services/data/schema/schema.models';
import { type FilterQuery } from '../../../services/util/filters/filters.models';
import { type XTableColumnType } from '../XTable.models';

import './XTable-Filter.scss';

export const cnXTableFilter = cn('XTable', 'Filter');

export interface XTableFilterProps extends IClassNameProps {
  field: string;
  filterQuery: FilterQuery;
  type: XTableColumnType;
  options?: PropertyOption[];
  onBeforeFilterChange(): void;
  onFilterChange(): void;
}

export const XTableFilterBase: FC<XTableFilterProps> = () => <div className={cnXTableFilter()} />;
