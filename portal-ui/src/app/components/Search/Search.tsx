import React, { FC, lazy, Suspense } from 'react';

const SearchAsync = lazy(() => import('./Search.async'));

export const Search: FC = props => (
  <Suspense>
    <SearchAsync {...props} />
  </Suspense>
);
