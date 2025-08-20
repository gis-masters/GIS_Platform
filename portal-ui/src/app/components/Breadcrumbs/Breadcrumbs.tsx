import React, { FC, lazy, Suspense } from 'react';

import { BreadcrumbsProps } from './Breadcrumbs.async';

export { BreadcrumbsItemData, BreadcrumbsProps } from './Breadcrumbs.async';

const BreadcrumbsAsync = lazy(() => import('./Breadcrumbs.async'));

export const Breadcrumbs: FC<BreadcrumbsProps> = props => (
  <Suspense>
    <BreadcrumbsAsync {...props} />
  </Suspense>
);
