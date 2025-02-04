import React, { FC, lazy, Suspense } from 'react';

import { MessagesRegistryProps } from './MessagesRegistry.async';

const MessagesRegistryAsync = lazy(() => import('./MessagesRegistry.async'));

export const MessagesRegistry: FC<MessagesRegistryProps> = props => (
  <Suspense>
    <MessagesRegistryAsync {...props} />
  </Suspense>
);
