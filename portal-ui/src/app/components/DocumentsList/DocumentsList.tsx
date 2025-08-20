import React, { FC, lazy, Suspense } from 'react';

import { DocumentsListProps } from './DocumentsList.async';

export { DocumentListItemData } from './DocumentsList.async';

const DocumentsListAsync = lazy(() => import('./DocumentsList.async'));

/**
 * @deprecated
 */
export const DocumentsList: FC<DocumentsListProps> = props => (
  <Suspense>
    <DocumentsListAsync {...props} />
  </Suspense>
);
