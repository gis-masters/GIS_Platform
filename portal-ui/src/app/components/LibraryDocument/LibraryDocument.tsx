import React, { type FC, lazy, Suspense } from 'react';

import { type LibraryDocumentProps } from './LibraryDocument.chunkroot';

const LibraryDocumentAsync = lazy(() => import('./LibraryDocument.chunkroot'));

export const LibraryDocument: FC<LibraryDocumentProps> = props => (
  <Suspense>
    <LibraryDocumentAsync {...props} />
  </Suspense>
);
