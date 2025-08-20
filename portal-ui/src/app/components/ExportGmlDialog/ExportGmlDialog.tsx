import React, { FC, lazy, Suspense } from 'react';

import { ExportGmlDialogProps } from './ExportGmlDialog.async';

const ExportGmlDialogAsync = lazy(() => import('./ExportGmlDialog.async'));

export const ExportGmlDialog: FC<ExportGmlDialogProps> = props => (
  <Suspense>
    <ExportGmlDialogAsync {...props} />
  </Suspense>
);
