import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../../stores/CurrentProject.store';
import { Pages, route } from '../../../stores/Route.store';
import { WorkspaceHeaderBreadcrumbsItem } from '../BreadcrumbsItem/WorkspaceHeader-BreadcrumbsItem';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Breadcrumbs.scss';

const cnWorkspaceHeaderBreadcrumbs = cn('WorkspaceHeader', 'Breadcrumbs');

export const WorkspaceHeaderBreadcrumbs: FC = observer(() => {
  let name = '';
  const { page } = route.data;

  if ([Pages.IMPORT, Pages.MAP].includes(page)) {
    name = currentProject.name;
  }

  let root: { url: string; title: string };

  if (page === Pages.ORG_ADMIN) {
    root = { url: '/org-admin', title: 'Управление организацией' };
  } else if ([Pages.DATA_MANAGEMENT, Pages.REGISTRY, Pages.DOCUMENT, Pages.TASKS_JOURNAL].includes(page)) {
    root = { url: '/data-management', title: 'Управление данными' };
  } else {
    root = { url: '/projects', title: 'Проекты' };
  }

  return (
    <div className={cnWorkspaceHeaderBreadcrumbs()}>
      <WorkspaceHeaderBreadcrumbsItem url={root.url}>{root.title}</WorkspaceHeaderBreadcrumbsItem>
      {name && <WorkspaceHeaderBreadcrumbsItem>{name}</WorkspaceHeaderBreadcrumbsItem>}
    </div>
  );
});
