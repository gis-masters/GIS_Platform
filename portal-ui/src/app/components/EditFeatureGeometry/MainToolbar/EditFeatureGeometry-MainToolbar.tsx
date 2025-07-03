import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-MainToolbar.scss';

const cnEditFeatureGeometryMainToolbar = cn('EditFeatureGeometry', 'MainToolbar');

export const EditFeatureGeometryMainToolbar: FC<ChildrenProps> = ({ children }) => (
  <Paper className={cnEditFeatureGeometryMainToolbar()} elevation={3}>
    {children}
  </Paper>
);
