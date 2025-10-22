import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Breadcrumbs-ItemTitle.scss';

const cnBreadcrumbsItemTitle = cn('Breadcrumbs', 'ItemTitle');

export const BreadcrumbsItemTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnBreadcrumbsItemTitle()}>{children}</div>
);
