import React, { type FC, lazy, Suspense } from 'react';

import { type FiasProps } from './Fias.chunkroot';

const FiasAsync = lazy(() => import('./Fias.chunkroot'));

export const Fias: FC<FiasProps> = props => (
  <Suspense>
    <FiasAsync {...props} />
  </Suspense>
);
