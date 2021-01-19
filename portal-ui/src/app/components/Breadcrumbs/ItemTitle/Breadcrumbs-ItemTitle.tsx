import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ItemTitle.scss';

const cnBreadcrumbsItemTitle = cn('Breadcrumbs', 'ItemTitle');

export const BreadcrumbsItemTitle: FC = ({ children }) => <div className={cnBreadcrumbsItemTitle()}>{children}</div>;
