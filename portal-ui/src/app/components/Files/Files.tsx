import React, { FC, lazy, Suspense } from 'react';

import { FilesProps } from './Files.async';

const FilesAsync = lazy(() => import('./Files.async'));

export const Files: FC<FilesProps> = props => (
  <Suspense>
    <FilesAsync {...props} />
  </Suspense>
);
