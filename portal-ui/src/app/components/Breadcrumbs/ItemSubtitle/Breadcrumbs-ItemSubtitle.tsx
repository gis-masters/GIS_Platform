import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemSubtitle.scss';

const cnBreadcrumbsItemSubtitle = cn('Breadcrumbs', 'ItemSubtitle');

export const BreadcrumbsItemSubtitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemSubtitle()}>{children}</div>
);
