import React, { type FC, lazy, Suspense } from 'react';

import { type LoginFormProps } from './LoginForm.chunkroot';

const LoginFormAsync = lazy(() => import('./LoginForm.chunkroot'));

export const LoginForm: FC<LoginFormProps> = props => (
  <Suspense>
    <LoginFormAsync {...props} />
  </Suspense>
);
