import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './EditFeatureGeometry-XY.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export const EditFeatureGeometryXY: FC = () => (
  <div className={cnEditFeatureGeometry('XY')}>
    <div className={cnEditFeatureGeometry('X')}>X</div>
    <div className={cnEditFeatureGeometry('Y')}>Y</div>
  </div>
);
