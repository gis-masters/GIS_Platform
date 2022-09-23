import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ChevronRight } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Divider.scss';

const cnBreadcrumbsDivider = cn('Breadcrumbs', 'Divider');

export const BreadcrumbsDivider: FC = () => (
  <div className={cnBreadcrumbsDivider()}>
    <ChevronRight fontSize='inherit' />
  </div>
);
