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

  let root: { url: string; title: string };

  switch (route.data.page) {
    case Pages.ORG_ADMIN:
      root = { url: '/org-admin', title: 'Управление организацией' };
      break;
    case Pages.DATA_MANAGEMENT:
      root = { url: '/data-management', title: 'Управление данными' };
      break;
    default:
      root = { url: '/projects', title: 'Проекты' };
  }

  return (
    <div className={cnWorkspaceHeaderBreadcrumbs()}>
      <WorkspaceHeaderBreadcrumbsItem url={root.url}>{root.title}</WorkspaceHeaderBreadcrumbsItem>
      {name && <WorkspaceHeaderBreadcrumbsItem>{name}</WorkspaceHeaderBreadcrumbsItem>}
    </div>
  );
});
