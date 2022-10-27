import React, { FC, lazy, Suspense } from 'react';

import { XmlDownloadProps } from './XmlDownload.async';

const XmlDownloadAsync = lazy(() => import('./XmlDownload.async'));

export const XmlDownload: FC<XmlDownloadProps> = props => (
  <Suspense>
    <XmlDownloadAsync {...props} />
  </Suspense>
);
