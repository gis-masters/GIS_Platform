import React, { type FC, lazy, Suspense } from 'react';

import { type LibraryRegistryProps } from './LibraryRegistry.chunkroot';

const LibraryRegistryAsync = lazy(() => import('./LibraryRegistry.chunkroot'));

export const LibraryRegistry: FC<LibraryRegistryProps> = props => (
  <Suspense>
    <LibraryRegistryAsync {...props} />
  </Suspense>
);
