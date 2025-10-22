import React, { type FC, lazy, Suspense } from 'react';

import { type PrintMapDialogProps } from './PrintMapDialog.chunkroot';

const PrintMapDialogAsync = lazy(() => import('./PrintMapDialog.chunkroot'));

export const PrintMapDialog: FC<PrintMapDialogProps> = props => (
  <Suspense>
    <PrintMapDialogAsync {...props} />
  </Suspense>
);
