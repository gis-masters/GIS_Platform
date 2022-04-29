import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-GroupFooter.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryGroupFooterProps {
  children: ReactNode;
}

export const EditFeatureGeometryGroupFooter: FC<EditFeatureGeometryGroupFooterProps> = ({ children }) => (
  <div className={cnEditFeatureGeometry('GroupFooter')}>{children}</div>
);
