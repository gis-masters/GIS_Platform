import React, { lazy, type ReactElement, Suspense } from 'react';

import { type XTableProps } from './XTable.chunkroot';

export { XTableProps, XTableInvoke } from './XTable.chunkroot';

const XTableAsync = lazy(() => import('./XTable.chunkroot')) as <T>(p: XTableProps<T>) => ReactElement;

export const XTable = (props => (
  <Suspense>
    <XTableAsync {...props} />
  </Suspense>
)) as <T>(p: XTableProps<T>) => ReactElement;
