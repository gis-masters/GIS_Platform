import React, { type FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './MapToolbar-Bar.scss';

const cnMapToolbarBar = cn('MapToolbar', 'Bar');

export const MapToolbarBar: FC<ChildrenProps> = ({ children }) => (
  <Paper className={cnMapToolbarBar()} elevation={3}>
    {children}
  </Paper>
);
