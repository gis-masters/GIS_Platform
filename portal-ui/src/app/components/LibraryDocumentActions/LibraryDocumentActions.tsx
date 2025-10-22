import React, { type FC, lazy, Suspense } from 'react';

import { type LibraryDocumentActionsProps } from './LibraryDocumentActions.chunkroot';

const LibraryDocumentActionsAsync = lazy(() => import('./LibraryDocumentActions.chunkroot'));

export const LibraryDocumentActions: FC<LibraryDocumentActionsProps> = props => (
  <Suspense>
    <LibraryDocumentActionsAsync {...props} />
  </Suspense>
);
