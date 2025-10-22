import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-ToolbarLeft.scss';

const cnEditFeatureGeometryToolbarLeft = cn('EditFeatureGeometry', 'ToolbarLeft');

export const EditFeatureGeometryToolbarLeft: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarLeft()}>{children}</div>
);
