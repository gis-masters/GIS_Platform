import React, { FC, lazy, Suspense } from 'react';

import { FormControlProps } from '../Form/Control/Form-Control';

const SelectColsControlAsync = lazy(() => import('./SelectColsControl.async'));

export const SelectColsControl: FC<FormControlProps> = props => (
  <Suspense>
    <SelectColsControlAsync {...props} />
  </Suspense>
);
