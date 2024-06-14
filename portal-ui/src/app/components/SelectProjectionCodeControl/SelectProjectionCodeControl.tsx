import React, { FC, lazy, Suspense } from 'react';

import { FormControlProps } from '../Form/Control/Form-Control';

const SelectProjectionCodeControlAsync = lazy(() => import('./SelectProjectionCodeControl.async'));

export const SelectProjectionCodeControl: FC<FormControlProps> = props => (
  <Suspense>
    <SelectProjectionCodeControlAsync {...props} />
  </Suspense>
);
