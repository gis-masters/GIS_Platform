import React, { FC, lazy, Suspense } from 'react';

const MapToolbarAsync = lazy(() => import('./MapToolbar.async'));

export const MapToolbar: FC = props => (
  <Suspense>
    <MapToolbarAsync {...props} />
  </Suspense>
);
