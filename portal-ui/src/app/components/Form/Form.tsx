import React, { lazy, type ReactElement, Suspense } from 'react';

import { type FormProps } from './Form.chunkroot';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control.composed';
export { FormProps } from './Form.chunkroot';

const FormAsync = lazy(() => import('./Form.chunkroot')) as <T>(p: FormProps<T>) => ReactElement;

export const Form = (props => (
  <Suspense>
    <FormAsync {...props} />
  </Suspense>
)) as <T>(p: FormProps<T>) => ReactElement;
