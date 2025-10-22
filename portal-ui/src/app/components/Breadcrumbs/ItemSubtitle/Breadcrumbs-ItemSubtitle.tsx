import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Breadcrumbs-ItemSubtitle.scss';

const cnBreadcrumbsItemSubtitle = cn('Breadcrumbs', 'ItemSubtitle');

export const BreadcrumbsItemSubtitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemSubtitle()}>{children}</div>
);
