import React, { lazy, ReactElement, Suspense } from 'react';

import { XTableProps } from './XTable.async';

export { XTableProps, XTableInvoke } from './XTable.async';

const XTableAsync = lazy(() => import('./XTable.async')) as <T>(p: XTableProps<T>) => ReactElement;

export const XTable = (props => (
  <Suspense>
    <XTableAsync {...props} />
  </Suspense>
)) as <T>(p: XTableProps<T>) => ReactElement;
