import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Toolbar.scss';

const cnEditFeatureGeometryToolbar = cn('EditFeatureGeometry', 'Toolbar');

export const EditFeatureGeometryToolbar: FC = ({ children }) => (
  <Paper className={cnEditFeatureGeometryToolbar()} square variant='outlined'>
    {children}
  </Paper>
);
