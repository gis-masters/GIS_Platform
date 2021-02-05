import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryToolbarLeft = cn('EditFeatureGeometry', 'ToolbarLeft');

export const EditFeatureGeometryToolbarLeft: FC = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarLeft()}>{children}</div>
);
