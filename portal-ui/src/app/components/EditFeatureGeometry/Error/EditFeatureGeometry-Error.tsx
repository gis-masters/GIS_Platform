import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometryError = cn('EditFeatureGeometry', 'Error');

export const EditFeatureGeometryError: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryError()}>{children}</div>
);
