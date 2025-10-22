import React, { type FC, lazy, Suspense } from 'react';

import { type FormControlProps } from '../Form/Control/Form-Control';

const SelectPropertiesControlAsync = lazy(() => import('./SelectPropertiesControl.chunkroot'));

export const SelectPropertiesControl: FC<FormControlProps> = props => (
  <Suspense>
    <SelectPropertiesControlAsync {...props} />
  </Suspense>
);
