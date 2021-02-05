import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryToolbarRight = cn('EditFeatureGeometry', 'ToolbarRight');

export const EditFeatureGeometryToolbarRight: FC = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarRight()}>{children}</div>
);
