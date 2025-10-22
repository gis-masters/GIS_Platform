import React, { type FC, lazy, Suspense } from 'react';

import type { DocumentsProps } from './Documents.chunkroot';

export { DocumentInfo } from './Documents.chunkroot';

const DocumentsAsync = lazy(() => import('./Documents.chunkroot'));

export const Documents: FC<DocumentsProps> = props => (
  <Suspense>
    <DocumentsAsync {...props} />
  </Suspense>
);
