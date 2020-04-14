import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { IconButton } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./Layer-Open.scss';

const cnLayerOpen = cn('Layer', 'Open');

interface LayerOpenProps {
  open: boolean;
  onClick: () => void;
}

export const LayerOpen: FC<LayerOpenProps> = ({ onClick, open }) => (
  <IconButton className={cnLayerOpen({ open })} onClick={onClick} size='small' color='primary'>
    <ChevronRight fontSize='inherit' />
  </IconButton>
);
