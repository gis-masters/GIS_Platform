import React, { type FC, lazy, Suspense } from 'react';

import { type ExportGmlDialogProps } from './ExportGmlDialog.chunkroot';

const ExportGmlDialogAsync = lazy(() => import('./ExportGmlDialog.chunkroot'));

export const ExportGmlDialog: FC<ExportGmlDialogProps> = props => (
  <Suspense>
    <ExportGmlDialogAsync {...props} />
  </Suspense>
);
