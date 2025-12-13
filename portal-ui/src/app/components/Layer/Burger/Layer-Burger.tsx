import React, { type FC } from 'react';
import { Menu } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import './Layer-Burger.scss';

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
