import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemTitle.scss';

const cnBreadcrumbsItemTitle = cn('Breadcrumbs', 'ItemTitle');

interface BreadcrumbsItemTitleProps {
  children: ReactNode;
}

export const BreadcrumbsItemTitle: FC<BreadcrumbsItemTitleProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemTitle()}>{children}</div>
);
