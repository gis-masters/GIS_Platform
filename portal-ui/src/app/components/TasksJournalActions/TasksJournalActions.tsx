import React, { type FC, lazy, Suspense } from 'react';

import { type TasksJournalActionsProps } from './TasksJournalActions.chunkroot';

const TasksJournalActionsAsync = lazy(() => import('./TasksJournalActions.chunkroot'));

export const TasksJournalActions: FC<TasksJournalActionsProps> = props => (
  <Suspense>
    <TasksJournalActionsAsync {...props} />
  </Suspense>
);
