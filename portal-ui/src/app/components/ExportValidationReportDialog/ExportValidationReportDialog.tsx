import React, { FC, lazy, Suspense } from 'react';

import { ExportValidationReportDialogProps } from './ExportValidationReportDialog.async';

const ExportValidationReportDialogAsync = lazy(() => import('./ExportValidationReportDialog.async'));

export const ExportValidationReportDialog: FC<ExportValidationReportDialogProps> = props => (
  <Suspense>
    <ExportValidationReportDialogAsync {...props} />
  </Suspense>
);
