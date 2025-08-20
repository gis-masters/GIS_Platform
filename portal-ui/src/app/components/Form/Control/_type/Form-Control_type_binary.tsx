import React, { FC, lazy, Suspense } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnFormControl, FormControlProps } from '../Form-Control';

const FormControlTypeBinaryAsync = lazy(() => import('./Form-Control_type_binary.async'));

const FormControlTypeBinary: FC<FormControlProps> = props => (
  <Suspense>
    <FormControlTypeBinaryAsync {...props} />
  </Suspense>
);

export const withTypeBinary = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.BINARY },
  () => FormControlTypeBinary
);
