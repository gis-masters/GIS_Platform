import React, { type FC, lazy, Suspense } from 'react';

import { type DocumentsListProps } from './DocumentsList.chunkroot';

const DocumentsListAsync = lazy(() => import('./DocumentsList.chunkroot'));

/**
 * @deprecated
 */
export const DocumentsList: FC<DocumentsListProps> = props => (
  <Suspense>
    <DocumentsListAsync {...props} />
  </Suspense>
);
