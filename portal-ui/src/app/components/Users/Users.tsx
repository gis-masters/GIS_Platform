import React, { FC, lazy, Suspense } from 'react';

import { UsersProps } from './Users.async';

const UsersAsync = lazy(() => import('./Users.async'));

export const Users: FC<UsersProps> = props => (
  <Suspense>
    <UsersAsync {...props} />
  </Suspense>
);
