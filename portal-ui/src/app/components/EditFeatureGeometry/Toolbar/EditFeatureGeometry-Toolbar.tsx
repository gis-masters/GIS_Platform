import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-Toolbar.scss';

const cnEditFeatureGeometryToolbar = cn('EditFeatureGeometry', 'Toolbar');

export const EditFeatureGeometryToolbar: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbar()}>{children}</div>
);
