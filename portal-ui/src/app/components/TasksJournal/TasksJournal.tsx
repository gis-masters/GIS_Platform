import React, { type FC, lazy, Suspense } from 'react';

const MessagesRegistryAsync = lazy(() => import('./TasksJournal.chunkroot'));

export const TasksJournal: FC = props => (
  <Suspense>
    <MessagesRegistryAsync {...props} />
  </Suspense>
);
