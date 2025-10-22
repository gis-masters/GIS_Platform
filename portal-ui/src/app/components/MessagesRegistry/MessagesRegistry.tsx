import React, { type FC, lazy, Suspense } from 'react';

import { type MessagesRegistryProps } from './MessagesRegistry.chunkroot';

const MessagesRegistryAsync = lazy(() => import('./MessagesRegistry.chunkroot'));

export const MessagesRegistry: FC<MessagesRegistryProps> = props => (
  <Suspense>
    <MessagesRegistryAsync {...props} />
  </Suspense>
);
