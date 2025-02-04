import React, { FC, lazy, Suspense } from 'react';

const ChangePasswordFormAsync = lazy(() => import('./ChangePasswordForm.async'));

export const ChangePasswordForm: FC = props => (
  <Suspense>
    <ChangePasswordFormAsync {...props} />
  </Suspense>
);
