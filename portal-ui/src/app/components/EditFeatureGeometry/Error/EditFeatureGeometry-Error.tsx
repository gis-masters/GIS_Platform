import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometryError = cn('EditFeatureGeometry', 'Error');

interface EditFeatureGeometryErrorProps {
  children: ReactNode;
}

export const EditFeatureGeometryError: FC<EditFeatureGeometryErrorProps> = ({ children }) => (
  <div className={cnEditFeatureGeometryError()}>{children}</div>
);
