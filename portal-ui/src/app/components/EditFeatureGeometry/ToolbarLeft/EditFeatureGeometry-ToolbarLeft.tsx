import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

const cnEditFeatureGeometryToolbarLeft = cn('EditFeatureGeometry', 'ToolbarLeft');

export const EditFeatureGeometryToolbarLeft: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarLeft()}>{children}</div>
);
