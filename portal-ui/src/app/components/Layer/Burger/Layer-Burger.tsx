import React, { FC } from 'react';
import { IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Burger.scss';

const cnLayerBurger = cn('Layer', 'Burger');

interface LayerBurgerProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const LayerBurger: FC<LayerBurgerProps> = ({ onClick, disabled }) => (
  <IconButton className={cnLayerBurger()} color='primary' size='small' onClick={onClick} disabled={disabled}>
    <Menu fontSize='inherit' />
  </IconButton>
);
