import React, { FC, lazy, Suspense } from 'react';

import { LibraryRegistryProps } from './LibraryRegistry.async';

const LibraryRegistryAsync = lazy(() => import('./LibraryRegistry.async'));

export const LibraryRegistry: FC<LibraryRegistryProps> = props => (
  <Suspense>
    <LibraryRegistryAsync {...props} />
  </Suspense>
);
