import React, { type FC, lazy, Suspense } from 'react';

import { type EditFeatureGeometryProps } from './EditFeatureGeometry.chunkroot';

const EditFeatureGeometryAsync = lazy(() => import('./EditFeatureGeometry.chunkroot'));

export const EditFeatureGeometry: FC<EditFeatureGeometryProps> = props => (
  <Suspense>
    <EditFeatureGeometryAsync {...props} />
  </Suspense>
);
