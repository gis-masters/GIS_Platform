import React, { FC, lazy, Suspense } from 'react';

import { DocumentsProps } from './Documents.async';

export { DocumentInfo } from './Documents.async';

const DocumentsAsync = lazy(() => import('./Documents.async'));

export const Documents: FC<DocumentsProps> = props => (
  <Suspense>
    <DocumentsAsync {...props} />
  </Suspense>
);
