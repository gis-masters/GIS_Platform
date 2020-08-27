import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-BreadcrumbsItem.scss';

const cnWorkspaceHeaderBreadcrumbsItem = cn('WorkspaceHeader', 'BreadcrumbsItem');

interface WorkspaceHeaderBreadcrumbsItemProps {
  url?: string;
}

export const WorkspaceHeaderBreadcrumbsItem: FC<WorkspaceHeaderBreadcrumbsItemProps> = ({ url, children }) =>
  url ? (
    <Link className={cnWorkspaceHeaderBreadcrumbsItem()} url={url}>
      {children}
    </Link>
  ) : (
    <span className={cnWorkspaceHeaderBreadcrumbsItem()}>{children}</span>
  );
