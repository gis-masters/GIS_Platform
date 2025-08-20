import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { IconButton } from '../IconButton/IconButton';

const cnFilterButton = cn('TableOverHead', 'FilterButton');

interface FilterButtonProps extends IClassNameProps {
  filterActive: boolean;
  onClick(): void;
}

export const FilterButton: FC<FilterButtonProps> = ({ filterActive, onClick, className }) => (
  <Tooltip title='Фильтр'>
    <IconButton className={cnFilterButton(null, [className])} onClick={onClick} checked={filterActive}>
      <FilterList />
    </IconButton>
  </Tooltip>
);
