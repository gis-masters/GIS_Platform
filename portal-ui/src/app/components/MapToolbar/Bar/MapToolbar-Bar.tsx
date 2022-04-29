import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./MapToolbar-Bar.scss';

const cnMapToolbarBar = cn('MapToolbar', 'Bar');

interface MapToolbarBarProps {
  children: ReactNode;
}

export const MapToolbarBar: FC<MapToolbarBarProps> = ({ children }) => (
  <Paper className={cnMapToolbarBar()} elevation={3}>
    {children}
  </Paper>
);
