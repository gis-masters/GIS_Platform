import React, { FC } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';

import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

interface BreadcrumbsItemTypeNoneProps extends IClassNameProps {
  type: 'none';
}

const ContainerComponent: FC<BreadcrumbsItemProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
);

export const withTypeNone = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeNoneProps>(
  cnBreadcrumbsItem(),
  { type: 'none' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
