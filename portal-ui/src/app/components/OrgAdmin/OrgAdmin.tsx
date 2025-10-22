import React, { type FC, lazy, Suspense } from 'react';

const OrgAdminAsync = lazy(() => import('./OrgAdmin.chunkroot'));

export const OrgAdmin: FC = props => (
  <Suspense>
    <OrgAdminAsync {...props} />
  </Suspense>
);
