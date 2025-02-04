import React, { FC, lazy, Suspense } from 'react';

import { ExplorerProps } from './Explorer.async';

const ExplorerAsync = lazy(() => import('./Explorer.async'));

export const Explorer: FC<ExplorerProps> = props => (
  <Suspense>
    <ExplorerAsync {...props} />
  </Suspense>
);
