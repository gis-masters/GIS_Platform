import React, { type FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { currentProject } from '../../../stores/CurrentProject.store';
import { Pages, route } from '../../../stores/Route.store';
import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { type BreadcrumbsItemData } from '../../Breadcrumbs/Breadcrumbs.chunkroot';
import { WorkspaceHeaderBreadcrumbsItem } from '../BreadcrumbsItem/WorkspaceHeader-BreadcrumbsItem';

import './WorkspaceHeader-Breadcrumbs.scss';

const cnWorkspaceHeaderBreadcrumbs = cn('WorkspaceHeader', 'Breadcrumbs');

const HOME_BREADCRUMB: BreadcrumbsItemData = {
  title: 'Проекты',
  url: '/projects'
};

export const WorkspaceHeaderBreadcrumbs: FC = observer(() => {
  const [fullBreadcrumbs, setFullBreadcrumbs] = useState<BreadcrumbsItemData[]>([]);

  let name = '';
  const { page } = route.data;

  useEffect(() => {
    // собираем полный путь если на карте проекта
    if (page === Pages.MAP) {
      const loadBreadcrumbs = async () => {
        const { path, name } = currentProject as CrgProject;

        const newBreadcrumbs: BreadcrumbsItemData[] = [HOME_BREADCRUMB];

        if (!path) {
          setFullBreadcrumbs([...newBreadcrumbs, { title: name, itemType: 'none' }]);

          return;
        }

        try {
          const pathIds = path.split('/').filter(notFalsyFilter);
          const parentFolders = await Promise.all(pathIds.map(id => projectsService.getById(Number(id))));

          parentFolders.forEach(folder => {
            if (folder?.folder) {
              newBreadcrumbs.push({
                title: folder.name,
                url: `/projects?projectFolderId=${folder.id}`
              });
            }
          });

          // Добавляем текущую папку
          newBreadcrumbs.push({
            title: name,
            itemType: 'none'
          });

          setFullBreadcrumbs(newBreadcrumbs);
        } catch (error) {
          console.error('Ошибка построения хлебных крошек:', error);
        }
      };

      void loadBreadcrumbs();
    }
  }, [page]);

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
      {!fullBreadcrumbs.length && (
        <>
          <WorkspaceHeaderBreadcrumbsItem url={root.url}>{root.title}</WorkspaceHeaderBreadcrumbsItem>

          {name && <WorkspaceHeaderBreadcrumbsItem>{name}</WorkspaceHeaderBreadcrumbsItem>}
        </>
      )}

      {!!fullBreadcrumbs.length && <Breadcrumbs items={fullBreadcrumbs} itemsType='link' size='medium' />}
    </div>
  );
});
