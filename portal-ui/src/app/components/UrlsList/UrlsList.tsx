import React, { type FC, lazy, Suspense } from 'react';

import { type UrlsListProps } from './UrlsList.chunkroot';

const UrlsListAsync = lazy(() => import('./UrlsList.chunkroot'));

export const UrlsList: FC<UrlsListProps> = props => (
  <Suspense>
    <UrlsListAsync {...props} />
  </Suspense>
);
