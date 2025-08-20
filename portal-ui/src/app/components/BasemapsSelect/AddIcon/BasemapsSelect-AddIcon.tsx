import React, { FC } from 'react';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-AddIcon.scss';

const cnBasemapsSelectAddIcon = cn('BasemapsSelect', 'AddIcon');

interface BasemapsSelectAddIconProps {
  onClick(): void;
}

export const BasemapsSelectAddIcon: FC<BasemapsSelectAddIconProps> = ({ onClick }) => (
  <Fab className={cnBasemapsSelectAddIcon()} onClick={onClick} size='small' color='primary'>
    <Add />
  </Fab>
);
