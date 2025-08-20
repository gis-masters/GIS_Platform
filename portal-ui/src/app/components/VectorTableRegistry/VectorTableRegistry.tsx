import React, { FC, lazy, Suspense } from 'react';

import { VectorTableRegistryProps } from './VectorTableRegistry.async';

const VectorTableRegistryAsync = lazy(() => import('./VectorTableRegistry.async'));

export const VectorTableRegistry: FC<VectorTableRegistryProps> = props => (
  <Suspense>
    <VectorTableRegistryAsync {...props} />
  </Suspense>
);
