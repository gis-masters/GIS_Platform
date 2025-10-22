import React, { type FC, lazy, Suspense } from 'react';

import { type TaskCardProps } from './TaskCard.chunkroot';

const TaskCardAsync = lazy(() => import('./TaskCard.chunkroot'));

export const TaskCard: FC<TaskCardProps> = props => (
  <Suspense>
    <TaskCardAsync {...props} />
  </Suspense>
);
