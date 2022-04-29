import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryToolbarRight = cn('EditFeatureGeometry', 'ToolbarRight');

interface EditFeatureGeometryToolbarRightProps {
  children: ReactNode;
}

export const EditFeatureGeometryToolbarRight: FC<EditFeatureGeometryToolbarRightProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryToolbarRight()}>{children}</div>
);
