import React, { type FC, lazy, Suspense } from 'react';

const DataImportAsync = lazy(() => import('./DataImport.chunkroot'));

export const DataImport: FC = props => (
  <Suspense>
    <DataImportAsync {...props} />
  </Suspense>
);
