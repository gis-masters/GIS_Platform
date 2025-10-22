import React, { type FC, lazy, Suspense } from 'react';

import { type ImportGmlResultsLinkProps } from './ImportGmlResultsLink.chunkroot';

const ImportGmlResultsLinkAsync = lazy(() => import('./ImportGmlResultsLink.chunkroot'));

export const ImportGmlResultsLink: FC<ImportGmlResultsLinkProps> = props => (
  <Suspense>
    <ImportGmlResultsLinkAsync {...props} />
  </Suspense>
);
