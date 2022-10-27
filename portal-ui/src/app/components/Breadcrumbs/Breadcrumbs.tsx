import React, { lazy, ReactElement, Suspense } from 'react';

import { BreadcrumbsProps } from './Breadcrumbs.async';

export { BreadcrumbsItemData, BreadcrumbsProps } from './Breadcrumbs.async';

const BreadcrumbsAsync = lazy(() => import('./Breadcrumbs.async')) as <T>(p: BreadcrumbsProps<T>) => ReactElement;

export const Breadcrumbs = (props => (
  <Suspense>
    <BreadcrumbsAsync {...props} />
  </Suspense>
)) as <T>(p: BreadcrumbsProps<T>) => ReactElement;
