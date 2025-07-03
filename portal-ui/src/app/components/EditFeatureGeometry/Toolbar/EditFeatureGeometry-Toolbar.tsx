import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Toolbar.scss';

const cnEditFeatureGeometryToolbar = cn('EditFeatureGeometry', 'Toolbar');

export const EditFeatureGeometryToolbar: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbar()}>{children}</div>
);
