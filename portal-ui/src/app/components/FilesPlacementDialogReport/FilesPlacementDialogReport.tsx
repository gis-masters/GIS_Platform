import React, { type FC, lazy, Suspense } from 'react';

import { type FilesPlacementDialogReportProps } from './FilesPlacementDialogReport.chunkroot';

const FilesPlacementDialogReportAsync = lazy(() => import('./FilesPlacementDialogReport.chunkroot'));

export const FilesPlacementDialogReport: FC<FilesPlacementDialogReportProps> = props => (
  <Suspense>
    <FilesPlacementDialogReportAsync {...props} />
  </Suspense>
);
