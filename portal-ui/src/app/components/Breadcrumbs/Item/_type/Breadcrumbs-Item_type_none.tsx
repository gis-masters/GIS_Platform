import React, { type FC } from 'react';
import { type IClassNameProps, withBemMod } from '@bem-react/core';

import { type BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item.base';

interface BreadcrumbsItemTypeNoneProps extends IClassNameProps {
  type: 'none';
}

const ContainerComponent: FC<BreadcrumbsItemProps> = ({ className, style, children }) => (
  <div className={className} style={style}>
    {children}
  </div>
);

export const withTypeNone = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeNoneProps>(
  cnBreadcrumbsItem(),
  { type: 'none' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
