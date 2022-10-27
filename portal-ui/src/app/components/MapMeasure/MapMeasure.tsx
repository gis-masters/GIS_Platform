import React, { FC, lazy, Suspense } from 'react';

const MapMeasureAsync = lazy(() => import('./MapMeasure.async'));

export const MapMeasure: FC = props => (
  <Suspense>
    <MapMeasureAsync {...props} />
  </Suspense>
);
