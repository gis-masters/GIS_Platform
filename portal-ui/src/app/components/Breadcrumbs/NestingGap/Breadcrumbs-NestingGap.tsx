import React, { type FC } from 'react';
import { SubdirectoryArrowRight } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './Breadcrumbs-NestingGap.scss';

const cnBreadcrumbsNestingGap = cn('Breadcrumbs', 'NestingGap');

export const BreadcrumbsNestingGap: FC = () => (
  <div className={cnBreadcrumbsNestingGap()}>
    <SubdirectoryArrowRight fontSize='small' color='action' />
  </div>
);
