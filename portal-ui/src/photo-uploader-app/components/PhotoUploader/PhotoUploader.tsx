import React, { type FC, lazy, Suspense } from 'react';

const PhotoUploaderAsync = lazy(() => import('./PhotoUploader.chunkroot'));

export const PhotoUploader: FC = () => (
  <Suspense>
    <PhotoUploaderAsync />
  </Suspense>
);
