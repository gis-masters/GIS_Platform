import React, { FC, lazy, Suspense } from 'react';

const MessagesRegistryAsync = lazy(() => import('./TasksJournal.async'));

export const TasksJournal: FC = props => (
  <Suspense>
    <MessagesRegistryAsync {...props} />
  </Suspense>
);
