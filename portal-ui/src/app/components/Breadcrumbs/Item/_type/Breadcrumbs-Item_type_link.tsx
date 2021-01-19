import React, { FC } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { ButtonBase } from '@material-ui/core';

import { Link } from '../../../Link/Link';

import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

interface BreadcrumbsItemTypeLinkProps extends IClassNameProps {
  type: 'link';
  url?: string;
}

const ContainerComponent: FC<BreadcrumbsItemProps> = ({ className, children, url }) => (
  <Link url={url} theme='none'>
    <ButtonBase className={className}>{children}</ButtonBase>
  </Link>
);

export const withTypeLink = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeLinkProps>(
  cnBreadcrumbsItem(),
  { type: 'link' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
