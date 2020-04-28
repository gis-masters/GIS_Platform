import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometryError = cn('EditFeatureGeometry', 'Error');

export const EditFeatureGeometryError: FC = ({ children }) => (
  <div className={cnEditFeatureGeometryError()}>
    {children}
  </div>
);
