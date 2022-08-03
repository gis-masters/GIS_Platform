import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemTitle.scss';

const cnBreadcrumbsItemTitle = cn('Breadcrumbs', 'ItemTitle');

export const BreadcrumbsItemTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemTitle()}>{children}</div>
);
