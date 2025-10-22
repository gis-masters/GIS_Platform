import React, { type FC, lazy, Suspense } from 'react';

const SearchAsync = lazy(() => import('./Search.chunkroot'));

export const Search: FC = props => (
  <Suspense>
    <SearchAsync {...props} />
  </Suspense>
);
