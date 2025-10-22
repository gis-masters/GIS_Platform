import React, { type FC, lazy, Suspense } from 'react';

import { type FormControlProps } from '../Form/Control/Form-Control';

const SelectProjectionCodeControlAsync = lazy(() => import('./SelectProjectionCodeControl.chunkroot'));

export const SelectProjectionCodeControl: FC<FormControlProps> = props => (
  <Suspense>
    <SelectProjectionCodeControlAsync {...props} />
  </Suspense>
);
