import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-GroupFooter.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryGroupFooter: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('GroupFooter')}>{children}</div>
);
