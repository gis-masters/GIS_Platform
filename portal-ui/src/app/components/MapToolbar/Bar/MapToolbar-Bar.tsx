import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./MapToolbar-Bar.scss';

const cnMapToolbarBar = cn('MapToolbar', 'Bar');

export const MapToolbarBar: FC<ChildrenProps> = ({ children }) => (
  <Paper className={cnMapToolbarBar()} elevation={3}>
    {children}
  </Paper>
);
