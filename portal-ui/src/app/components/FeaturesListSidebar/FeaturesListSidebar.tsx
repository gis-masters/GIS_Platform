import React, { FC, lazy, Suspense } from 'react';

const FeaturesListSidebarAsync = lazy(() => import('./FeaturesListSidebar.async'));

export const FeaturesListSidebar: FC = props => (
  <Suspense>
    <FeaturesListSidebarAsync {...props} />
  </Suspense>
);
