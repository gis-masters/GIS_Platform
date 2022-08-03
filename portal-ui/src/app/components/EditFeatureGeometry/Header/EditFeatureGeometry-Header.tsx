import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Header.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryHeader: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('Header')}>{children}</div>
);
