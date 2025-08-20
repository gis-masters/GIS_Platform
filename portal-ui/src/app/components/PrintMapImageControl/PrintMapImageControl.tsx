import React, { FC, lazy, Suspense } from 'react';

import { FormControlProps } from '../Form/Control/Form-Control';

const PrintMapImageControlAsync = lazy(() => import('./PrintMapImageControl.async'));

export const PrintMapImageControl: FC<FormControlProps> = props => (
  <Suspense>
    <PrintMapImageControlAsync {...props} />
  </Suspense>
);
