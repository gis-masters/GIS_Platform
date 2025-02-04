import React, { FC, lazy, Suspense } from 'react';

import { PrintMapDialogProps } from './PrintMapDialog.async';

const PrintMapDialogAsync = lazy(() => import('./PrintMapDialog.async'));

export const PrintMapDialog: FC<PrintMapDialogProps> = props => (
  <Suspense>
    <PrintMapDialogAsync {...props} />
  </Suspense>
);
