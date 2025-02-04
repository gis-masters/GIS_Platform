import React, { lazy, ReactElement, Suspense } from 'react';

import { ChooseXTableDialogProps } from './ChooseXTableDialog.async';

export { ChooseXTableDialogProps } from './ChooseXTableDialog.async';

const ChooseXTableDialogAsync = lazy(() => import('./ChooseXTableDialog.async')) as <T>(
  p: ChooseXTableDialogProps<T>
) => ReactElement;

export const ChooseXTableDialog = (props => (
  <Suspense>
    <ChooseXTableDialogAsync {...props} />
  </Suspense>
)) as <T>(p: ChooseXTableDialogProps<T>) => ReactElement;
