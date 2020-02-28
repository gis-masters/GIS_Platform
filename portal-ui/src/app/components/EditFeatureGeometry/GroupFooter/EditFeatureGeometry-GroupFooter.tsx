import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-GroupFooter.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryGroupFooter: FC = ({ children }) => (
  <div className={cnEditFeatureGeometry('GroupFooter')}>
    {children}
  </div>
);
