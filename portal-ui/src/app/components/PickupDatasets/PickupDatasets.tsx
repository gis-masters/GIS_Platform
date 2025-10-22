import React, { type FC, lazy, Suspense } from 'react';

import { type PickupDatasetsProps } from './PickupDatasets.chunkroot';

const PickupDatasetsAsync = lazy(() => import('./PickupDatasets.chunkroot'));

export const PickupDatasets: FC<PickupDatasetsProps> = props => (
  <Suspense>
    <PickupDatasetsAsync {...props} />
  </Suspense>
);
