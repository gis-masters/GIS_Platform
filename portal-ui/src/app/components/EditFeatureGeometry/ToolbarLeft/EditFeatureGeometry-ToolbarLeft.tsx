import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryToolbarLeft = cn('EditFeatureGeometry', 'ToolbarLeft');

interface EditFeatureGeometryToolbarLeftProps {
  children: ReactNode;
}

export const EditFeatureGeometryToolbarLeft: FC<EditFeatureGeometryToolbarLeftProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarLeft()}>{children}</div>
);
