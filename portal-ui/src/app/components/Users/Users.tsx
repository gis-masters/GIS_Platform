import React, { type FC, lazy, Suspense } from 'react';

import { type UsersProps } from './Users.chunkroot';

const UsersAsync = lazy(() => import('./Users.chunkroot'));

export const Users: FC<UsersProps> = props => (
  <Suspense>
    <UsersAsync {...props} />
  </Suspense>
);
