import React, { type FC, lazy, Suspense } from 'react';

const MapToolbarAsync = lazy(() => import('./MapToolbar.chunkroot'));

export const MapToolbar: FC = props => (
  <Suspense>
    <MapToolbarAsync {...props} />
  </Suspense>
);
