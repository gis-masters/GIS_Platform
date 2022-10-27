import React, { FC, lazy, Suspense } from 'react';

const LayersSidebarAsync = lazy(() => import('./LayersSidebar.async'));

export const LayersSidebar: FC = props => (
  <Suspense>
    <LayersSidebarAsync {...props} />
  </Suspense>
);
