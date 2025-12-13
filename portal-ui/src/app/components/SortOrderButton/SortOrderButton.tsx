import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { Sort } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { IconButton } from '../IconButton/IconButton';

import './SortOrderButton.scss';

const cnSortOrderButton = cn('SortOrderButton');

interface SortOrderButtonProps extends IClassNameProps {
  asc: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const SortOrderButton: FC<SortOrderButtonProps> = ({ asc, onClick, className }) => (
  <Tooltip title={asc ? 'По возрастанию' : 'По убыванию'}>
    <IconButton className={cnSortOrderButton({ asc }, [className])} onClick={onClick}>
      <Sort />
    </IconButton>
  </Tooltip>
);
