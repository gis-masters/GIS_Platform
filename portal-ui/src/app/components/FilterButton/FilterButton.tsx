import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';

const cnFilterButton = cn('TableOverHead', 'FilterButton');

interface FilterButtonProps extends IClassNameProps {
  filterActive: boolean;
  onClick: () => void;
}

export const FilterButton: FC<FilterButtonProps> = ({ filterActive, onClick, className }) => (
  <Tooltip title='Фильтр'>
    <IconButton
      className={cnFilterButton(null, [className])}
      onClick={onClick}
      color={filterActive ? 'secondary' : 'default'}
    >
      <FilterList />
    </IconButton>
  </Tooltip>
);
