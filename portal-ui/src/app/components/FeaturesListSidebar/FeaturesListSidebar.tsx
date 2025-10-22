import React, { type FC, lazy, Suspense } from 'react';

const FeaturesListSidebarAsync = lazy(() => import('./FeaturesListSidebar.chunkroot'));

export const FeaturesListSidebar: FC = props => (
  <Suspense>
    <FeaturesListSidebarAsync {...props} />
  </Suspense>
);
