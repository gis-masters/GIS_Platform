import React, { FC, lazy, Suspense } from 'react';

import { FilesPlacementDialogReportProps } from './FilesPlacementDialogReport.async';

const FilesPlacementDialogReportAsync = lazy(() => import('./FilesPlacementDialogReport.async'));

export const FilesPlacementDialogReport: FC<FilesPlacementDialogReportProps> = props => (
  <Suspense>
    <FilesPlacementDialogReportAsync {...props} />
  </Suspense>
);
