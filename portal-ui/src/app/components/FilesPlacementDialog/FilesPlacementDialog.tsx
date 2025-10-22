import React, { type FC, lazy, Suspense } from 'react';

import { type FilesPlacementDialogProps } from './FilesPlacementDialog.chunkroot';

const FilesPlacementDialogAsync = lazy(() => import('./FilesPlacementDialog.chunkroot'));

export const FilesPlacementDialog: FC<FilesPlacementDialogProps> = props => (
  <Suspense>
    <FilesPlacementDialogAsync {...props} />
  </Suspense>
);
