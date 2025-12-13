import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';
import { LayerOpenIcon } from '../OpenIcon/Layer-OpenIcon';

import './Layer-Open.scss';

const cnLayerOpen = cn('Layer', 'Open');

interface LayerOpenProps {
  open: boolean;
  disabled: boolean;
  onClick(): void;
}

export const LayerOpen: FC<LayerOpenProps> = ({ onClick, open, disabled }) => (
  <IconButton className={cnLayerOpen()} onClick={onClick} size='small' color='primary' disabled={disabled}>
    <LayerOpenIcon open={open} />
  </IconButton>
);
