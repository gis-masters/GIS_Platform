import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-BreadcrumbsItem.scss';

const cnWorkspaceHeaderBreadcrumbsItem = cn('WorkspaceHeader', 'BreadcrumbsItem');

interface WorkspaceHeaderBreadcrumbsItemProps extends ChildrenProps {
  url?: string;
}

export const WorkspaceHeaderBreadcrumbsItem: FC<WorkspaceHeaderBreadcrumbsItemProps> = ({ url, children }) =>
  url ? (
    <Link className={cnWorkspaceHeaderBreadcrumbsItem()} href={url}>
      {children}
    </Link>
  ) : (
    <span className={cnWorkspaceHeaderBreadcrumbsItem()}>{children}</span>
  );
