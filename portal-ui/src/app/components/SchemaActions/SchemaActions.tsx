import React, { FC, lazy, Suspense } from 'react';

import { SchemaActionsProps } from './SchemaActions.async';

const SchemaActionsAsync = lazy(() => import('./SchemaActions.async'));

export const SchemaActions: FC<SchemaActionsProps> = props => (
  <Suspense>
    <SchemaActionsAsync {...props} />
  </Suspense>
);
