import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Header.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryHeaderProps {
  children: ReactNode;
}

export const EditFeatureGeometryHeader: FC<EditFeatureGeometryHeaderProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('Header')}>{children}</div>
);
