import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { projectsService } from '../../../services/gis/projects/projects.service';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { currentProjectFolderStore } from '../../../stores/CurrentProjectFolder.store';
import { Breadcrumbs, BreadcrumbsItemData } from '../../Breadcrumbs/Breadcrumbs';
import { ProjectsFilter } from '../Filter/Projects-Filter';
import { ProjectsSortBy } from '../SortBy/Projects-SortBy';
import { ProjectsSortOrder } from '../SortOrder/Projects-SortOrder';

import '!style-loader!css-loader!sass-loader!./Projects-Header.scss';

const cnProjectsHeader = cn('Projects', 'Header');

const HOME_BREADCRUMB: BreadcrumbsItemData = {
  title: <HomeOutlined fontSize='inherit' />,
  url: '/projects'
};

export const ProjectsHeader: FC = observer(() => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsItemData[]>([HOME_BREADCRUMB]);

  useEffect(() => {
    let mounted = true;

    const loadBreadcrumbs = async () => {
      const { currentFolder } = currentProjectFolderStore;

      if (!currentFolder) {
        setBreadcrumbs([]);

        return;
      }

      const { path, name } = currentFolder;

      const newBreadcrumbs: BreadcrumbsItemData[] = [HOME_BREADCRUMB];

      // Если нет пути, добавляем только текущую папку
      if (!path) {
        if (mounted) {
          setBreadcrumbs([...newBreadcrumbs, { title: name, itemType: 'none' }]);
        }

        return;
      }

      try {
        // Получаем массив ID из пути, фильтруем пустые значения
        const pathIds = path.split('/').filter(Boolean).filter(notFalsyFilter);

        // Загружаем информацию о родительских папках
        const parentFolders = await Promise.all(pathIds.map(id => projectsService.getById(Number(id))));

        // Добавляем родительские папки в хлебные крошки
        parentFolders.forEach(folder => {
          if (folder && mounted) {
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

        if (mounted) {
          setBreadcrumbs(newBreadcrumbs);
        }
      } catch (error) {
        console.error('Ошибка построения хлебных крошек:', error);
      }
    };

    void loadBreadcrumbs();

    return () => {
      mounted = false;
    };
  }, [currentProjectFolderStore.currentFolder]);

  return (
    <div className={cnProjectsHeader()}>
      <Breadcrumbs items={breadcrumbs} itemsType='link' size='medium' />
      <div className={cnProjectsHeader({ rightActions: true })}>
        <ProjectsFilter />
        <ProjectsSortBy />
        <ProjectsSortOrder />
      </div>
    </div>
  );
});
