import React, { type FC, lazy, Suspense } from 'react';

const LayersSidebarAsync = lazy(() => import('./LayersSidebar.chunkroot'));

export const LayersSidebar: FC = props => (
  <Suspense>
    <LayersSidebarAsync {...props} />
  </Suspense>
);
