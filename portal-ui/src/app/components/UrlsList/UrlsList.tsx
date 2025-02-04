import React, { FC, lazy, Suspense } from 'react';

import { UrlsListProps } from './UrlsList.async';

const UrlsListAsync = lazy(() => import('./UrlsList.async'));

export const UrlsList: FC<UrlsListProps> = props => (
  <Suspense>
    <UrlsListAsync {...props} />
  </Suspense>
);
