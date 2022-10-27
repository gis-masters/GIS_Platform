import React, { FC, lazy, Suspense } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

const FormControlTypeFiasAsync = lazy(() => import('./Form-Control_type_fias.async'));

const FormControlTypeFias: FC<FormControlProps> = props => (
  <Suspense>
    <FormControlTypeFiasAsync {...props} />
  </Suspense>
);

export const withTypeFias = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FIAS },
  () => FormControlTypeFias
);
