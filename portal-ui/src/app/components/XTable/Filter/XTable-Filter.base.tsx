import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyOption, PropertyType } from '../../../services/data/schema/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';

import '!style-loader!css-loader!sass-loader!./XTable-Filter.scss';

export const cnXTableFilter = cn('XTable', 'Filter');

export interface XTableFilterProps extends IClassNameProps {
  field: string;
  filterQuery: FilterQuery;
  type: PropertyType;
  options: PropertyOption[];
  onBeforeFilterChange: () => void;
  onFilterChange: () => void;
}

export const XTableFilterBase: FC<XTableFilterProps> = () => <div className={cnXTableFilter()} />;
