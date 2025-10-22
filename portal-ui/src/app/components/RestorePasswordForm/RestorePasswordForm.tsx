import React, { type FC, lazy, Suspense } from 'react';

const RestorePasswordFormAsync = lazy(() => import('./RestorePasswordForm.chunkroot'));

export const RestorePasswordForm: FC = props => (
  <Suspense>
    <RestorePasswordFormAsync {...props} />
  </Suspense>
);
