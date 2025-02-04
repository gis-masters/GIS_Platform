import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { PropertyOption } from '../../../services/data/schema/schema.models';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { XTableColumnType } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-Filter.scss';

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
