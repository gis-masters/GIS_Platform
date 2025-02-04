import React, { FC, lazy, Suspense } from 'react';

import { FormControlProps } from '../Form/Control/Form-Control';

const PrintMapFileControlAsync = lazy(() => import('./PrintMapFileControl.async'));

export const PrintMapFileControl: FC<FormControlProps> = props => (
  <Suspense>
    <PrintMapFileControlAsync {...props} />
  </Suspense>
);
