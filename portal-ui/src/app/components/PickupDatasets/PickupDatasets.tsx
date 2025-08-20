import React, { FC, lazy, Suspense } from 'react';

import { PickupDatasetsProps } from './PickupDatasets.async';

const PickupDatasetsAsync = lazy(() => import('./PickupDatasets.async'));

export const PickupDatasets: FC<PickupDatasetsProps> = props => (
  <Suspense>
    <PickupDatasetsAsync {...props} />
  </Suspense>
);
