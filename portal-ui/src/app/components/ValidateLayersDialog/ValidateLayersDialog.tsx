import React, { type FC, lazy, Suspense } from 'react';

import { type ValidateLayersDialogProps } from './ValidateLayersDialog.chunkroot';

const ValidateLayersDialogAsync = lazy(() => import('./ValidateLayersDialog.chunkroot'));

export const ValidateLayersDialog: FC<ValidateLayersDialogProps> = props => (
  <Suspense>
    <ValidateLayersDialogAsync {...props} />
  </Suspense>
);
