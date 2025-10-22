import React, { type FC } from 'react';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './Breadcrumbs-Divider.scss';

const cnBreadcrumbsDivider = cn('Breadcrumbs', 'Divider');

interface BreadcrumbsDividerProps {
  down?: boolean;
  edge?: boolean;
}

export const BreadcrumbsDivider: FC<BreadcrumbsDividerProps> = ({ down, edge }) => {
  const Icon = down ? ExpandMore : ChevronRight;

  return (
    <div className={cnBreadcrumbsDivider({ edge })}>
      <Icon fontSize='inherit' />
    </div>
  );
};
