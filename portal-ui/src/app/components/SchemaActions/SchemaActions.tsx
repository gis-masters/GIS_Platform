import React, { type FC, lazy, Suspense } from 'react';

import { type SchemaActionsProps } from './SchemaActions.chunkroot';

const SchemaActionsAsync = lazy(() => import('./SchemaActions.chunkroot'));

export const SchemaActions: FC<SchemaActionsProps> = props => (
  <Suspense>
    <SchemaActionsAsync {...props} />
  </Suspense>
);
