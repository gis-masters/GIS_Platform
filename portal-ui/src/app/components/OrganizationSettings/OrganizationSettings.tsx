import React, { type FC, lazy, Suspense } from 'react';

import { type OrganizationSettingsProps } from './OrganizationSettings.chunkroot';

const OrganizationSettingsAsync = lazy(() => import('./OrganizationSettings.chunkroot'));

export const OrganizationSettings: FC<OrganizationSettingsProps> = props => (
  <Suspense>
    <OrganizationSettingsAsync {...props} />
  </Suspense>
);
