import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-Header.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryHeader: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('Header')}>{children}</div>
);
