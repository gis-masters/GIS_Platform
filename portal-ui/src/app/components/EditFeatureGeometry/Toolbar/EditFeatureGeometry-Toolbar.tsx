import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Toolbar.scss';

const cnEditFeatureGeometryToolbar = cn('EditFeatureGeometry', 'Toolbar');

export const EditFeatureGeometryToolbar: FC<ChildrenProps> = ({ children }) => (
  <Paper className={cnEditFeatureGeometryToolbar()} square variant='outlined'>
    {children}
  </Paper>
);
