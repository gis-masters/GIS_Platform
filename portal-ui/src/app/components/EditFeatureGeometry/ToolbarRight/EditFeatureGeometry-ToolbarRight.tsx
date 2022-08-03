import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

const cnEditFeatureGeometryToolbarRight = cn('EditFeatureGeometry', 'ToolbarRight');

export const EditFeatureGeometryToolbarRight: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarRight()}>{children}</div>
);
