import React, { FC, lazy, Suspense } from 'react';

import { ValidateLayersDialogProps } from './ValidateLayersDialog.async';

const ValidateLayersDialogAsync = lazy(() => import('./ValidateLayersDialog.async'));

export const ValidateLayersDialog: FC<ValidateLayersDialogProps> = props => (
  <Suspense>
    <ValidateLayersDialogAsync {...props} />
  </Suspense>
);
