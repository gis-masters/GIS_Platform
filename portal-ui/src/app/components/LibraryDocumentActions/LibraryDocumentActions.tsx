import React, { FC, lazy, Suspense } from 'react';

import { LibraryDocumentActionsProps } from './LibraryDocumentActions.async';

const LibraryDocumentActionsAsync = lazy(() => import('./LibraryDocumentActions.async'));

export const LibraryDocumentActions: FC<LibraryDocumentActionsProps> = props => (
  <Suspense>
    <LibraryDocumentActionsAsync {...props} />
  </Suspense>
);
