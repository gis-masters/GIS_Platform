import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../../stores/CurrentProject.store';
import { route } from '../../../stores/Route.store';
import { Pages } from '../../../app-routing.module';

import { WorkspaceHeaderBreadcrumbsItem } from '../BreadcrumbsItem/WorkspaceHeader-BreadcrumbsItem';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Breadcrumbs.scss';

const cnWorkspaceHeaderBreadcrumbs = cn('WorkspaceHeader', 'Breadcrumbs');

export const WorkspaceHeaderBreadcrumbs: FC = observer(() => {
  let name = '';
  const { page } = route.data;

  if ([Pages.IMPORT, Pages.MAP].includes(page)) {
    name = currentProject.name;
  }

  const root =
    route.data.page === Pages.ORG_ADMIN
      ? { url: '/org-admin', title: 'Управление организацией' }
      : { url: '/projects', title: 'Проекты' };

  return (
    <div className={cnWorkspaceHeaderBreadcrumbs()}>
      <WorkspaceHeaderBreadcrumbsItem url={root.url}>{root.title}</WorkspaceHeaderBreadcrumbsItem>
      {name && <WorkspaceHeaderBreadcrumbsItem>{name}</WorkspaceHeaderBreadcrumbsItem>}
    </div>
  );
});
