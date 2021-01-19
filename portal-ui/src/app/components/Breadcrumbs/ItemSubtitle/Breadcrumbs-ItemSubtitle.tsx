import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemSubtitle.scss';

const cnBreadcrumbsItemSubtitle = cn('Breadcrumbs', 'ItemSubtitle');

export const BreadcrumbsItemSubtitle: FC = ({ children }) => (
  <div className={cnBreadcrumbsItemSubtitle()}>{children}</div>
);
