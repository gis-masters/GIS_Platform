import React, { FC, lazy, Suspense } from 'react';

import { FormControlProps } from '../Form/Control/Form-Control';

const SelectPropertiesControlAsync = lazy(() => import('./SelectPropertiesControl.async'));

export const SelectPropertiesControl: FC<FormControlProps> = props => (
  <Suspense>
    <SelectPropertiesControlAsync {...props} />
  </Suspense>
);
