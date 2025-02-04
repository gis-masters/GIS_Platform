import React, { FC, lazy, Suspense } from 'react';

import { LibraryDocumentProps } from './LibraryDocument.async';

const LibraryDocumentAsync = lazy(() => import('./LibraryDocument.async'));

export const LibraryDocument: FC<LibraryDocumentProps> = props => (
  <Suspense>
    <LibraryDocumentAsync {...props} />
  </Suspense>
);
