import React, { type FC, lazy, Suspense } from 'react';

import { type FilesProps } from './Files.chunkroot';

const FilesAsync = lazy(() => import('./Files.chunkroot'));

export const Files: FC<FilesProps> = props => (
  <Suspense>
    <FilesAsync {...props} />
  </Suspense>
);
