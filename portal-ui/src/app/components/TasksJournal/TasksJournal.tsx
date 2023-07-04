import React, { FC, lazy, Suspense } from 'react';

import { TasksJournalProps } from './TasksJournal.async';

const MessagesRegistryAsync = lazy(() => import('./TasksJournal.async'));

export const TasksJournal: FC<TasksJournalProps> = props => (
  <Suspense>
    <MessagesRegistryAsync {...props} />
  </Suspense>
);
