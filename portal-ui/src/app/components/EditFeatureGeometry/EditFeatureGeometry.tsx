import React, { FC, lazy, Suspense } from 'react';

import { EditFeatureGeometryProps } from './EditFeatureGeometry.async';

const EditFeatureGeometryAsync = lazy(() => import('./EditFeatureGeometry.async'));

export const EditFeatureGeometry: FC<EditFeatureGeometryProps> = props => (
  <Suspense>
    <EditFeatureGeometryAsync {...props} />
  </Suspense>
);
