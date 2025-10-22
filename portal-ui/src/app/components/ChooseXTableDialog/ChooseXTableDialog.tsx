import React, { lazy, type ReactElement, Suspense } from 'react';

import { type ChooseXTableDialogProps } from './ChooseXTableDialog.chunkroot';

export { ChooseXTableDialogProps } from './ChooseXTableDialog.chunkroot';

const ChooseXTableDialogAsync = lazy(() => import('./ChooseXTableDialog.chunkroot')) as <T>(
  p: ChooseXTableDialogProps<T>
) => ReactElement;

export const ChooseXTableDialog = (props => (
  <Suspense>
    <ChooseXTableDialogAsync {...props} />
  </Suspense>
)) as <T>(p: ChooseXTableDialogProps<T>) => ReactElement;
