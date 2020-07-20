import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import { IClassNameProps } from '@bem-react/core';

const cnFilterButton = cn('TableOverHead', 'FilterButton');

interface FilterButtonProps extends IClassNameProps {
  filterEnabled: boolean;
  onClick: () => void;
}

export const FilterButton: FC<FilterButtonProps> = ({ filterEnabled, onClick, className }) => (
  <Tooltip title='Фильтр'>
    <IconButton
      className={cnFilterButton(null, [className])}
      onClick={onClick}
      color={filterEnabled ? 'secondary' : 'default'}
    >
      <FilterList />
    </IconButton>
  </Tooltip>
);
