import React, { FC, lazy, Suspense } from 'react';

const OrgAdminAsync = lazy(() => import('./OrgAdmin.async'));

export const OrgAdmin: FC = props => (
  <Suspense>
    <OrgAdminAsync {...props} />
  </Suspense>
);
