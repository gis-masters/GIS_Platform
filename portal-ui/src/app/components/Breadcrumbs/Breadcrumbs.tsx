import React, { type FC, lazy, Suspense } from 'react';

import { type BreadcrumbsProps } from './Breadcrumbs.chunkroot';

export { BreadcrumbsItemData, BreadcrumbsProps } from './Breadcrumbs.chunkroot';

const BreadcrumbsAsync = lazy(() => import('./Breadcrumbs.chunkroot'));

export const Breadcrumbs: FC<BreadcrumbsProps> = props => (
  <Suspense>
    <BreadcrumbsAsync {...props} />
  </Suspense>
);
