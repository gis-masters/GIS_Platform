import React, { type FC, lazy, Suspense } from 'react';

import { type ExportValidationReportDialogProps } from './ExportValidationReportDialog.chunkroot';

const ExportValidationReportDialogAsync = lazy(() => import('./ExportValidationReportDialog.chunkroot'));

export const ExportValidationReportDialog: FC<ExportValidationReportDialogProps> = props => (
  <Suspense>
    <ExportValidationReportDialogAsync {...props} />
  </Suspense>
);
