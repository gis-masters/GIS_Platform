import React, { FC, lazy, Suspense } from 'react';

import { FilesPlacementDialogProps } from './FilesPlacementDialog.async';

const FilesPlacementDialogAsync = lazy(() => import('./FilesPlacementDialog.async'));

export const FilesPlacementDialog: FC<FilesPlacementDialogProps> = props => (
  <Suspense>
    <FilesPlacementDialogAsync {...props} />
  </Suspense>
);
