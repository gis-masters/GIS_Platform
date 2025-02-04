import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { cn } from '@bem-react/classname';

import { LayerOpenIcon } from '../OpenIcon/Layer-OpenIcon';

import '!style-loader!css-loader!sass-loader!./Layer-Open.scss';

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
