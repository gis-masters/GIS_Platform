import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Divider.scss';

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
