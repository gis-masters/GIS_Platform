import React, { FC, lazy, Suspense } from 'react';

const RestorePasswordFormAsync = lazy(() => import('./RestorePasswordForm.async'));

export const RestorePasswordForm: FC = props => (
  <Suspense>
    <RestorePasswordFormAsync {...props} />
  </Suspense>
);
