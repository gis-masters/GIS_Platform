import React, { type FC, lazy, Suspense } from 'react';

import { type VectorTableRegistryProps } from './VectorTableRegistry.chunkroot';

const VectorTableRegistryAsync = lazy(() => import('./VectorTableRegistry.chunkroot'));

export const VectorTableRegistry: FC<VectorTableRegistryProps> = props => (
  <Suspense>
    <VectorTableRegistryAsync {...props} />
  </Suspense>
);
