import React, { FC, lazy, Suspense } from 'react';

const PhotoUploaderAsync = lazy(() => import('./PhotoUploader.async'));

export const PhotoUploader: FC = () => (
  <Suspense>
    <PhotoUploaderAsync />
  </Suspense>
);
