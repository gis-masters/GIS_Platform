import React, { FC, lazy, Suspense } from 'react';

const DataImportAsync = lazy(() => import('./DataImport.async'));

export const DataImport: FC = props => (
  <Suspense>
    <DataImportAsync {...props} />
  </Suspense>
);
