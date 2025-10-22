import React, { type FC, lazy, Suspense } from 'react';

import { type ExplorerProps } from './Explorer.chunkroot';

const ExplorerAsync = lazy(() => import('./Explorer.chunkroot'));

export const Explorer: FC<ExplorerProps> = props => (
  <Suspense>
    <ExplorerAsync {...props} />
  </Suspense>
);
