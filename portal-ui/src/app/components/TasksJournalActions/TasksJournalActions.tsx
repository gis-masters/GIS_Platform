import React, { FC, lazy, Suspense } from 'react';

import { TasksJournalActionsProps } from './TasksJournalActions.async';

const TasksJournalActionsAsync = lazy(() => import('./TasksJournalActions.async'));

export const TasksJournalActions: FC<TasksJournalActionsProps> = props => (
  <Suspense>
    <TasksJournalActionsAsync {...props} />
  </Suspense>
);
