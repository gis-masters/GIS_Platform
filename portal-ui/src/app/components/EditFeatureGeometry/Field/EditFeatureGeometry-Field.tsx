import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './EditFeatureGeometry-Field.scss';

const cnEditFeatureGeometryField = cn('EditFeatureGeometry', 'Field');

export const EditFeatureGeometryField: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryField()}>{children}</div>
);
