import React, { FC, lazy, Suspense } from 'react';

import { LoginFormProps } from './LoginForm.async';

const LoginFormAsync = lazy(() => import('./LoginForm.async'));

export const LoginForm: FC<LoginFormProps> = props => (
  <Suspense>
    <LoginFormAsync {...props} />
  </Suspense>
);
