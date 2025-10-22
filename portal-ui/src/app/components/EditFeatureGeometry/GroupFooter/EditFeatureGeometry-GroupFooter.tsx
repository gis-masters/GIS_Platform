import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-GroupFooter.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryGroupFooter: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('GroupFooter')}>{children}</div>
);
