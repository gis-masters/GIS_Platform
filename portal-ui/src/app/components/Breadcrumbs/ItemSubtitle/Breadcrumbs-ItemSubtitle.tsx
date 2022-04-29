import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemSubtitle.scss';

const cnBreadcrumbsItemSubtitle = cn('Breadcrumbs', 'ItemSubtitle');

interface BreadcrumbsItemSubtitleProps {
  children: ReactNode;
}

export const BreadcrumbsItemSubtitle: FC<BreadcrumbsItemSubtitleProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemSubtitle()}>{children}</div>
);
