import React, { FC, lazy, Suspense } from 'react';

import { OrganizationSettingsProps } from './OrganizationSettings.async';

const OrganizationSettingsAsync = lazy(() => import('./OrganizationSettings.async'));

export const OrganizationSettings: FC<OrganizationSettingsProps> = props => (
  <Suspense>
    <OrganizationSettingsAsync {...props} />
  </Suspense>
);
