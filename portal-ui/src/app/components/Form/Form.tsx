import React, { lazy, ReactElement, Suspense } from 'react';

import { FormProps } from './Form.async';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control.composed';
export { FormProps } from './Form.async';

const FormAsync = lazy(() => import('./Form.async')) as <T>(p: FormProps<T>) => ReactElement;

export const Form = (props => (
  <Suspense>
    <FormAsync {...props} />
  </Suspense>
)) as <T>(p: FormProps<T>) => ReactElement;
