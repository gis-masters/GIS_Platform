import React, { FC, lazy, Suspense } from 'react';

import { TaskCardProps } from './TaskCard.async';

const TaskCardAsync = lazy(() => import('./TaskCard.async'));

export const TaskCard: FC<TaskCardProps> = props => (
  <Suspense>
    <TaskCardAsync {...props} />
  </Suspense>
);
