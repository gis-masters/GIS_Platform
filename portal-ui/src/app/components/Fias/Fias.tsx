import React, { FC, lazy, Suspense } from 'react';

import { FiasProps } from './Fias.async';

const FiasAsync = lazy(() => import('./Fias.async'));

export const Fias: FC<FiasProps> = props => (
  <Suspense>
    <FiasAsync {...props} />
  </Suspense>
);
