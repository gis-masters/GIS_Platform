import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Header.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryHeader: FC = ({ children }) => (
  <div className={cnEditFeatureGeometry('Header')}>
    {children}
  </div>
);
