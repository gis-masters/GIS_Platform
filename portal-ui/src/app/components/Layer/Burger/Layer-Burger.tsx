import React, { FC } from 'react';
import { IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Burger.scss';

const cnLayerBurger = cn('Layer', 'Burger');

interface LayerBurgerProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LayerBurger: FC<LayerBurgerProps> = ({ onClick }) => (
  <IconButton className={cnLayerBurger()} color='primary' size='small' onClick={onClick}>
    <Menu fontSize='inherit' />
  </IconButton>
);
