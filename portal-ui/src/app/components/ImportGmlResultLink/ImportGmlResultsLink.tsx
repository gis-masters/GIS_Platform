import React, { FC, lazy, Suspense } from 'react';

import { ImportGmlResultsLinkProps } from './ImportGmlResultsLink.async';

const ImportGmlResultsLinkAsync = lazy(() => import('./ImportGmlResultsLink.async'));

export const ImportGmlResultsLink: FC<ImportGmlResultsLinkProps> = props => (
  <Suspense>
    <ImportGmlResultsLinkAsync {...props} />
  </Suspense>
);
