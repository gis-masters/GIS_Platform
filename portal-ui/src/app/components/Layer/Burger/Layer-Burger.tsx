import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Burger.scss';

const cnLayerBurger = cn('Layer', 'Burger');

interface LayerBurgerProps {
  disabled?: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

export const LayerBurger: FC<LayerBurgerProps> = ({ onClick, disabled }) => (
  <IconButton className={cnLayerBurger()} color='primary' size='small' onClick={onClick} disabled={disabled}>
    <Menu fontSize='inherit' />
  </IconButton>
);
