import React, { type FC, lazy, Suspense } from 'react';

import { type FormControlProps } from '../Form/Control/Form-Control';

const BboxPreviewAsync = lazy(() => import('./BboxPreview.chunkroot'));

export const BboxPreview: FC<FormControlProps> = props => (
  <Suspense>
    <BboxPreviewAsync {...props} />
  </Suspense>
);
