import React, { type FC, lazy, Suspense } from 'react';

const ChangePasswordFormAsync = lazy(() => import('./ChangePasswordForm.chunkroot'));

export const ChangePasswordForm: FC = props => (
  <Suspense>
    <ChangePasswordFormAsync {...props} />
  </Suspense>
);
