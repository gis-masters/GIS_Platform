import React, { type FC, lazy, Suspense } from 'react';

import { type XmlDownloadProps } from './XmlDownload.chunkroot';

const XmlDownloadAsync = lazy(() => import('./XmlDownload.chunkroot'));

export const XmlDownload: FC<XmlDownloadProps> = props => (
  <Suspense>
    <XmlDownloadAsync {...props} />
  </Suspense>
);
