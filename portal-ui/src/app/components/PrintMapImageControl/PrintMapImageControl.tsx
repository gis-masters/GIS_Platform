import React, { type FC, lazy, Suspense } from 'react';

import { type FormControlProps } from '../Form/Control/Form-Control';

const PrintMapImageControlAsync = lazy(() => import('./PrintMapImageControl.chunkroot'));

export const PrintMapImageControl: FC<FormControlProps> = props => (
  <Suspense>
    <PrintMapImageControlAsync {...props} />
  </Suspense>
);
