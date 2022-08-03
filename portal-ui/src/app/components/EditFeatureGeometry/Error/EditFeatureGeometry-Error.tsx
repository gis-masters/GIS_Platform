import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometryError = cn('EditFeatureGeometry', 'Error');

export const EditFeatureGeometryError: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryError()}>{children}</div>
);
