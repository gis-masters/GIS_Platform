import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Toolbar.scss';

const cnEditFeatureGeometryToolbar = cn('EditFeatureGeometry', 'Toolbar');

interface EditFeatureGeometryToolbarProps {
  children: ReactNode;
}

export const EditFeatureGeometryToolbar: FC<EditFeatureGeometryToolbarProps> = ({ children }) => (
  <Paper className={cnEditFeatureGeometryToolbar()} square variant='outlined'>
    {children}
  </Paper>
);
